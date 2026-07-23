const UserSubscription  = require('../models/UserSubscription');
const SubscriptionPlan  = require('../models/SubscriptionPlan');
const BillingHistory    = require('../models/BillingHistory');
const Invoice           = require('../models/Invoice');
const Payment           = require('../models/Payment');
const User              = require('../models/User');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL PLANS ─────────────────────────────────────────────────────────────
const getAllPlans = async () => {
  let plans = await SubscriptionPlan.find({ isActive: true }).sort({ sortOrder: 1 });

  if (!plans || plans.length === 0) {
    // Seed default plans if none in database
    const defaultPlans = [
      {
        name: 'free',
        displayName: 'Free Starter',
        tagline: 'Basic access for self-paced coders',
        description: 'Get started with essential coding tracks, public workspaces, and community access.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        currency: 'INR',
        limits: { sandboxMinutes: 60, aiCredits: 30, storageGB: 1, downloadsPerMonth: 3, maxWorkspaces: 2, maxTeamSeats: 1, liveSessionsLimit: 1 },
        features: { learningPaths: 3, resources: false, codexAccess: true, sandboxAccess: true, testsAccess: true, prioritySupport: false },
        sortOrder: 1,
      },
      {
        name: 'student_pro',
        displayName: 'Student Pro',
        tagline: 'Empowering computer science students',
        description: 'Full access to all course tracks, certificate verification, AI mentor, and expanded sandbox time.',
        monthlyPrice: 299,
        quarterlyPrice: 799,
        yearlyPrice: 2499,
        usdMonthlyPrice: 5,
        usdYearlyPrice: 39,
        currency: 'INR',
        badge: '50% Student Off',
        limits: { sandboxMinutes: 300, aiCredits: 250, storageGB: 10, downloadsPerMonth: 25, maxWorkspaces: 10, maxTeamSeats: 1, liveSessionsLimit: 5 },
        features: { learningPaths: -1, resources: true, createCommunities: true, joinSessions: true, codexAccess: true, privateCodex: true, sandboxAccess: true, advancedSandbox: true, testsAccess: true, analyticsAccess: true, eventRegistration: true, aiRoadmap: true, prioritySupport: false },
        sortOrder: 2,
      },
      {
        name: 'professional',
        displayName: 'Professional',
        tagline: 'For developers, software engineers & architects',
        description: 'Unlimited AI codex, priority sandbox compute, live architectural sessions, and advanced certifications.',
        monthlyPrice: 799,
        quarterlyPrice: 2199,
        yearlyPrice: 6999,
        usdMonthlyPrice: 12,
        usdYearlyPrice: 99,
        currency: 'INR',
        isFeatured: true,
        badge: 'Most Popular',
        limits: { sandboxMinutes: -1, aiCredits: -1, storageGB: 50, downloadsPerMonth: -1, maxWorkspaces: 25, maxTeamSeats: 1, liveSessionsLimit: -1 },
        features: { learningPaths: -1, resources: true, createCommunities: true, joinSessions: true, codexAccess: true, privateCodex: true, sandboxAccess: true, advancedSandbox: true, testsAccess: true, analyticsAccess: true, advancedAnalytics: true, eventRegistration: true, aiRoadmap: true, prioritySupport: true, apiAccess: true },
        sortOrder: 3,
      },
      {
        name: 'team',
        displayName: 'Team Professional',
        tagline: 'Collaborative development & shared workspace for teams',
        description: 'Centralized billing, seat assignment, team analytics dashboard, and shared sandbox instances.',
        monthlyPrice: 2499,
        quarterlyPrice: 6999,
        yearlyPrice: 21999,
        usdMonthlyPrice: 35,
        usdYearlyPrice: 299,
        currency: 'INR',
        badge: '5 Seats Included',
        limits: { sandboxMinutes: -1, aiCredits: -1, storageGB: 200, downloadsPerMonth: -1, maxWorkspaces: 100, maxTeamSeats: 5, liveSessionsLimit: -1 },
        features: { learningPaths: -1, resources: true, createCommunities: true, joinSessions: true, codexAccess: true, privateCodex: true, sandboxAccess: true, advancedSandbox: true, testsAccess: true, analyticsAccess: true, advancedAnalytics: true, prioritySupport: true, apiAccess: true, customBranding: true },
        sortOrder: 4,
      },
      {
        name: 'enterprise',
        displayName: 'Enterprise Licensing',
        tagline: 'Custom scale, dedicated infrastructure & SSO',
        description: 'Dedicated account manager, Okta/SAML SSO, custom SLA, audit compliance, and private deployment options.',
        monthlyPrice: 9999,
        yearlyPrice: 89999,
        usdMonthlyPrice: 149,
        usdYearlyPrice: 1299,
        currency: 'INR',
        badge: 'Enterprise Grade',
        limits: { sandboxMinutes: -1, aiCredits: -1, storageGB: 1000, downloadsPerMonth: -1, maxWorkspaces: -1, maxTeamSeats: 25, liveSessionsLimit: -1 },
        features: { learningPaths: -1, resources: true, createCommunities: true, joinSessions: true, codexAccess: true, privateCodex: true, sandboxAccess: true, advancedSandbox: true, testsAccess: true, analyticsAccess: true, advancedAnalytics: true, prioritySupport: true, apiAccess: true, customBranding: true, ssoSupport: true, dedicatedAccountManager: true },
        sortOrder: 5,
      },
    ];

    plans = await SubscriptionPlan.insertMany(defaultPlans);
  }

  return plans;
};

// ─── GET CURRENT SUBSCRIPTION ─────────────────────────────────────────────────
const getCurrentSubscription = async (userId) => {
  let subscription = await UserSubscription.findOne({ userId, status: { $in: ['active', 'trial', 'paused'] } })
    .populate('planId');

  if (!subscription) {
    let freePlan = await SubscriptionPlan.findOne({ name: 'free' });
    if (!freePlan) {
      await getAllPlans();
      freePlan = await SubscriptionPlan.findOne({ name: 'free' });
    }
    if (freePlan) {
      subscription = await UserSubscription.create({
        userId,
        planId:       freePlan._id,
        planName:     'free',
        billingCycle: 'monthly',
        amount:       0,
        startDate:    new Date(),
        endDate:      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status:       'active',
        paymentStatus:'paid',
      });
      subscription = await subscription.populate('planId');
    }
  }

  return subscription;
};

// ─── CREATE / SUBSCRIBE ───────────────────────────────────────────────────────
const createSubscription = async (userId, body) => {
  const { planName, billingCycle = 'monthly', paymentMethod = 'card', couponCode = '' } = body;

  const plan = await SubscriptionPlan.findOne({ name: planName });
  if (!plan) throw createError('Selected plan not found', 404);

  let price = billingCycle === 'yearly' ? plan.yearlyPrice : (billingCycle === 'quarterly' ? plan.quarterlyPrice : plan.monthlyPrice);
  if (!price && price !== 0) price = plan.monthlyPrice;

  let discountAmount = 0;

  // Apply coupon if provided
  if (couponCode) {
    const Coupon = require('../models/Coupon');
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon && new Date() <= new Date(coupon.validUntil)) {
      if (coupon.discountType === 'percentage') {
        discountAmount = (price * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const finalAmount = Math.max(0, price - discountAmount);

  // Cancel any existing active subscription
  await UserSubscription.updateMany({ userId, status: { $in: ['active', 'trial', 'paused'] } }, { status: 'cancelled', cancelledAt: new Date() });

  const durationDays = billingCycle === 'yearly' ? 365 : (billingCycle === 'quarterly' ? 90 : 30);
  const startDate = new Date();
  const endDate   = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  const subscription = await UserSubscription.create({
    userId,
    planId: plan._id,
    planName,
    billingCycle,
    amount: finalAmount,
    currency: plan.currency || 'INR',
    couponApplied: couponCode,
    discountAmount,
    startDate,
    endDate,
    renewalDate: endDate,
    status: 'active',
    paymentStatus: 'paid',
  });

  await User.findByIdAndUpdate(userId, { plan: planName });

  // Create billing, payment and invoice records
  await _createBillingRecords(subscription, plan, 'subscription', paymentMethod);

  return subscription.populate('planId');
};

// ─── PAUSE SUBSCRIPTION ───────────────────────────────────────────────────────
const pauseSubscription = async (userId) => {
  const subscription = await UserSubscription.findOne({ userId, status: 'active' });
  if (!subscription) throw createError('No active subscription to pause', 404);

  subscription.status = 'paused';
  subscription.pausedAt = new Date();
  await subscription.save();

  return subscription;
};

// ─── RESUME SUBSCRIPTION ──────────────────────────────────────────────────────
const resumeSubscription = async (userId) => {
  const subscription = await UserSubscription.findOne({ userId, status: 'paused' });
  if (!subscription) throw createError('No paused subscription to resume', 404);

  subscription.status = 'active';
  subscription.pausedAt = null;
  await subscription.save();

  return subscription;
};

// ─── CANCEL SUBSCRIPTION ──────────────────────────────────────────────────────
const cancelSubscription = async (userId, reason = '') => {
  const subscription = await UserSubscription.findOne({ userId, status: { $in: ['active', 'paused'] } });
  if (!subscription) throw createError('No active subscription found', 404);

  subscription.status       = 'cancelled';
  subscription.autoRenew    = false;
  subscription.cancelledAt  = new Date();
  subscription.cancelReason = reason;
  await subscription.save();

  await User.findByIdAndUpdate(userId, { plan: 'free' });

  return { message: 'Subscription cancelled. You will remain on the free tier.' };
};

// ─── GET MY SUBSCRIPTIONS (History) ───────────────────────────────────────────
const getMySubscriptions = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const total = await UserSubscription.countDocuments({ userId });
  const { skip, ...meta } = getPagination(page, limit, total);

  const subscriptions = await UserSubscription.find({ userId })
    .populate('planId', 'displayName monthlyPrice yearlyPrice features badge')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, subscriptions };
};

// ─── GET INVOICES ─────────────────────────────────────────────────────────────
const getMyInvoices = async (userId) => {
  return Invoice.find({ userId }).sort({ createdAt: -1 });
};

// ─── INTERNAL RECORD BUILDER ──────────────────────────────────────────────────
const _createBillingRecords = async (subscription, plan, billingType, paymentMethod = 'stripe') => {
  const taxAmount = Math.round(subscription.amount * 0.18); // 18% GST
  const totalAmount = Math.round(subscription.amount + taxAmount);

  const billing = await BillingHistory.create({
    userId:         subscription.userId,
    subscriptionId: subscription._id,
    planId:         plan._id,
    billingType,
    planName:       plan.displayName,
    billingCycle:   subscription.billingCycle,
    amount:         subscription.amount,
    tax:            taxAmount,
    discount:       subscription.discountAmount || 0,
    total:          totalAmount,
    periodStart:    subscription.startDate,
    periodEnd:      subscription.endDate,
    status:         'paid',
  });

  const invoice = await Invoice.create({
    userId:         subscription.userId,
    billingId:      billing._id,
    subscriptionId: subscription._id,
    planName:       plan.displayName,
    billingCycle:   subscription.billingCycle,
    amount:         subscription.amount,
    tax:            taxAmount,
    discount:       subscription.discountAmount || 0,
    total:          totalAmount,
    paymentMethod,
    status:         'paid',
    paidAt:         new Date(),
  });

  await Payment.create({
    userId:         subscription.userId,
    subscriptionId: subscription._id,
    invoiceId:      invoice._id,
    amount:         totalAmount,
    paymentMethod,
    status:         'completed',
    paidAt:         new Date(),
  });

  return { billing, invoice };
};

module.exports = {
  getAllPlans,
  getCurrentSubscription,
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  getMySubscriptions,
  getMyInvoices,
};
