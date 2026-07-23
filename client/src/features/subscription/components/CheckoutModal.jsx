import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, CreditCard, ShieldCheck, CheckCircle2, QrCode, Tag, ArrowRight, Loader2 } from 'lucide-react';
import {
  setCheckoutModalOpen,
  subscribeToPlanThunk,
  selectCheckoutModalOpen,
  selectSelectedPlanForCheckout,
  selectSelectedBillingCycle,
  selectCurrency,
} from '../redux';
import { validateCouponAPI } from '../services/subscriptionAPI';

export const CheckoutModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectCheckoutModalOpen);
  const plan = useSelector(selectSelectedPlanForCheckout);
  const cycle = useSelector(selectSelectedBillingCycle);
  const currency = useSelector(selectCurrency);

  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, razorpay, stripe, paypal
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !plan) return null;

  const basePrice =
    cycle === 'yearly' ? plan.yearlyPrice || plan.monthlyPrice * 10 : cycle === 'quarterly' ? plan.quarterlyPrice || plan.monthlyPrice * 2.7 : plan.monthlyPrice || 0;

  const tax = Math.round((basePrice - appliedDiscount) * 0.18);
  const total = Math.max(0, basePrice - appliedDiscount + tax);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await validateCouponAPI({
        code: couponCode,
        amount: basePrice,
        planName: plan.name,
      });
      setAppliedDiscount(res.data.discountAmount);
      setCouponMsg(`Coupon applied: Saved ₹${res.data.discountAmount}`);
    } catch (err) {
      setCouponMsg(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  const handleCompletePayment = async () => {
    setLoading(true);
    try {
      await dispatch(
        subscribeToPlanThunk({
          planName: plan.name,
          billingCycle: cycle,
          paymentMethod,
          couponCode,
        })
      );
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        dispatch(setCheckoutModalOpen(false));
      }, 2000);
    } catch (err) {
      alert('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative flex flex-col gap-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Checkout & Payment
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-semibold border border-purple-500/20">
                128-bit Encrypted
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Complete your subscription to unlock CodeSphere Pro features</p>
          </div>
          <button
            onClick={() => dispatch(setCheckoutModalOpen(false))}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Successful!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Your subscription to {plan.displayName} is now active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Method Selector */}
            <div className="flex flex-col gap-4">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select Payment Gateway</label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'razorpay', label: 'Razorpay', icon: CreditCard },
                  { id: 'stripe', label: 'Stripe Card', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: CreditCard },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                        paymentMethod === m.id
                          ? 'bg-purple-600/10 border-purple-500 text-purple-600 dark:text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Coupon Code Input */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Have a Promo Code?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="ENTER CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && <span className="text-[11px] text-purple-600 dark:text-purple-300">{couponMsg}</span>}
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Order Summary</h4>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Plan: {plan.displayName}</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount Applied</span>
                    <span className="font-mono">-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>GST (18%)</span>
                  <span className="font-mono">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-lg font-mono text-purple-600 dark:text-purple-400">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleCompletePayment}
                className="w-full mt-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-xl shadow-purple-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    Pay ₹{total.toLocaleString('en-IN')} & Subscribe <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
