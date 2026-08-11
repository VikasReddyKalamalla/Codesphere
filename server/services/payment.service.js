const crypto = require('crypto');
let Stripe;
try {
  Stripe = require('stripe');
} catch (err) {
  console.warn('[PaymentService] stripe package not loaded:', err.message);
}
let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (err) {
  console.warn('[PaymentService] razorpay package not loaded:', err.message);
}
const Payment          = require('../models/Payment');
const Invoice          = require('../models/Invoice');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const UserSubscription = require('../models/UserSubscription');
const User             = require('../models/User');
const { getPagination } = require('../utils/pagination');
const { generateInvoicePDF } = require('../utils/invoiceGenerator');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Initialize SDKs when keys and modules are available
const stripe = (Stripe && process.env.STRIPE_SECRET_KEY) ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const razorpay = (Razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

// ─── STRIPE CHECKOUT SESSION ──────────────────────────────────────────────────
const createStripeCheckoutSession = async (userId, { planName, billingCycle = 'monthly', successUrl, cancelUrl }) => {
  const plan = await SubscriptionPlan.findOne({ name: planName });
  if (!plan) throw createError('Subscription plan not found', 404);

  const amount = billingCycle === 'yearly' ? plan.yearlyPrice : (billingCycle === 'quarterly' ? plan.quarterlyPrice : plan.monthlyPrice);
  if (!amount || amount <= 0) throw createError('Free plans do not require a payment session', 400);

  const origin = process.env.CLIENT_URL || 'http://localhost:5173';
  const defaultSuccessUrl = `${origin}/subscription?session_id={CHECKOUT_SESSION_ID}&success=true`;
  const defaultCancelUrl  = `${origin}/subscription?canceled=true`;

  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: (plan.currency || 'INR').toLowerCase(),
            product_data: {
              name: `CodeSphere ${plan.displayName} (${billingCycle})`,
              description: plan.description,
            },
            unit_amount: amount * 100, // Amount in cents/paise
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || defaultSuccessUrl,
      cancel_url:  cancelUrl  || defaultCancelUrl,
      client_reference_id: userId.toString(),
      metadata: { userId: userId.toString(), planName, billingCycle },
    });

    return { sessionId: session.id, checkoutUrl: session.url, provider: 'stripe' };
  } else {
    // Development mock response
    const mockId = `cs_stripe_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      sessionId: mockId,
      checkoutUrl: successUrl || defaultSuccessUrl.replace('{CHECKOUT_SESSION_ID}', mockId),
      provider: 'stripe_mock',
      message: 'Stripe API key not configured. Generated development session.',
    };
  }
};

// ─── RAZORPAY ORDER CREATION ──────────────────────────────────────────────────
const createRazorpayOrder = async (userId, { planName, billingCycle = 'monthly' }) => {
  const plan = await SubscriptionPlan.findOne({ name: planName });
  if (!plan) throw createError('Subscription plan not found', 404);

  const amount = billingCycle === 'yearly' ? plan.yearlyPrice : (billingCycle === 'quarterly' ? plan.quarterlyPrice : plan.monthlyPrice);
  if (!amount || amount <= 0) throw createError('Free plans do not require a payment order', 400);

  const receipt = `rcpt_${userId.toString().slice(-6)}_${Date.now().toString().slice(-6)}`;

  if (razorpay) {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: plan.currency || 'INR',
      receipt,
      notes: { userId: userId.toString(), planName, billingCycle },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      provider: 'razorpay',
    };
  } else {
    // Development mock response
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return {
      orderId: mockOrderId,
      amount: amount * 100,
      currency: plan.currency || 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
      provider: 'razorpay_mock',
      message: 'Razorpay keys not configured. Generated development order.',
    };
  }
};

// ─── VERIFY RAZORPAY PAYMENT SIGNATURE ─────────────────────────────────────────
const verifyRazorpaySignature = async (userId, { orderId, paymentId, signature, planName, billingCycle }) => {
  if (!orderId || !paymentId) throw createError('Order ID and Payment ID are required', 400);

  if (razorpay && process.env.RAZORPAY_KEY_SECRET) {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      throw createError('Invalid Razorpay signature verification failed', 400);
    }
  }

  // Activate subscription upon verified payment
  if (planName) {
    const subscriptionService = require('./subscription.service');
    await subscriptionService.createSubscription(userId, { planName, billingCycle, paymentMethod: 'razorpay' });
  }

  return { verified: true, orderId, paymentId };
};

// ─── PRODUCTION WEBHOOK EVENT HANDLER ─────────────────────────────────────────
const handleWebhookEvent = async (req) => {
  const stripeSignature = req.headers['stripe-signature'];
  const razorpaySignature = req.headers['x-razorpay-signature'];
  const subscriptionService = require('./subscription.service');

  // Handle Stripe Webhooks
  if (stripeSignature && stripe && process.env.STRIPE_WEBHOOK_SECRET) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw createError(`Stripe Webhook Signature Verification Failed: ${err.message}`, 400);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, planName, billingCycle } = session.metadata || {};
        if (userId && planName) {
          await subscriptionService.createSubscription(userId, { planName, billingCycle, paymentMethod: 'stripe' });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        if (subscriptionId) {
          const sub = await UserSubscription.findOne({ stripeSubscriptionId: subscriptionId });
          if (sub) {
            sub.status = 'active';
            sub.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await sub.save();
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const sub = await UserSubscription.findOne({ stripeSubscriptionId: subscription.id });
        if (sub) {
          sub.status = 'cancelled';
          sub.cancelledAt = new Date();
          await sub.save();
          await User.findByIdAndUpdate(sub.userId, { plan: 'free' });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const sub = await UserSubscription.findOne({ stripeSubscriptionId: invoice.subscription });
        if (sub) {
          sub.status = 'past_due';
          await sub.save();
        }
        break;
      }
    }
    return { received: true, type: event.type };
  }
  
  // Handle Razorpay Webhooks
  if (razorpaySignature && process.env.RAZORPAY_WEBHOOK_SECRET) {
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(typeof req.body === 'string' ? req.body : JSON.stringify(req.body))
      .digest('hex');

    if (expectedSig !== razorpaySignature) {
      throw createError('Razorpay Webhook Signature Verification Failed', 400);
    }

    const event = req.body;
    if (event.event === 'payment.captured' || event.event === 'subscription.charged') {
      const notes = event.payload?.payment?.entity?.notes || {};
      if (notes.userId && notes.planName) {
        await subscriptionService.createSubscription(notes.userId, {
          planName: notes.planName,
          billingCycle: notes.billingCycle || 'monthly',
          paymentMethod: 'razorpay',
        });
      }
    }
    return { received: true, type: event.event };
  }

  // Generic / Mock Webhook Endpoint
  const genericBody = req.body || {};
  return {
    received: true,
    status: 'processed',
    event: genericBody.event || 'test_webhook',
    timestamp: new Date().toISOString(),
  };
};

// ─── GET MY PAYMENTS ───────────────────────────────────────────────────────────
const getMyPayments = async (userId, { page = 1, limit = 10 }) => {
  const total = await Payment.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const payments = await Payment.find({ userId })
    .populate('invoiceId', 'invoiceNumber total currency status')
    .sort({ paidAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, payments };
};

// ─── GET PAYMENT BY ID ────────────────────────────────────────────────────────
const getPaymentById = async (paymentId, userId) => {
  const payment = await Payment.findById(paymentId)
    .populate('subscriptionId')
    .populate('invoiceId');

  if (!payment) throw createError('Payment not found', 404);
  if (payment.userId.toString() !== userId.toString()) {
    throw createError('You are not authorized to view this payment', 403);
  }

  return payment;
};

// ─── DOWNLOAD INVOICE PDF ─────────────────────────────────────────────────────
const getInvoicePDFBuffer = async (invoiceId, userId) => {
  const invoice = await Invoice.findById(invoiceId).populate('userId', 'fullName name email');
  if (!invoice) throw createError('Invoice not found', 404);

  if (invoice.userId._id.toString() !== userId.toString()) {
    throw createError('You are not authorized to download this invoice', 403);
  }

  return generateInvoicePDF(invoice);
};

module.exports = {
  createStripeCheckoutSession,
  createRazorpayOrder,
  verifyRazorpaySignature,
  handleWebhookEvent,
  getMyPayments,
  getPaymentById,
  getInvoicePDFBuffer,
};
