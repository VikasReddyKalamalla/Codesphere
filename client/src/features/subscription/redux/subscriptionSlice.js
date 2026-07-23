import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
  currentSubscription: null,
  invoices: [],
  usageData: null,
  activeCoupons: [],
  referralData: null,
  organizationData: null,
  selectedBillingCycle: 'monthly', // monthly, quarterly, yearly
  currency: 'INR', // INR, USD, EUR
  activeViewTab: 'overview', // overview, plans, usage, invoices, team, university, coupons, referral, ai_insights, admin
  appliedCoupon: null,
  checkoutModalOpen: false,
  selectedPlanForCheckout: null,
  status: 'idle',
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
    setCurrentSubscription: (state, action) => {
      state.currentSubscription = action.payload;
    },
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setUsageData: (state, action) => {
      state.usageData = action.payload;
    },
    setActiveCoupons: (state, action) => {
      state.activeCoupons = action.payload;
    },
    setReferralData: (state, action) => {
      state.referralData = action.payload;
    },
    setOrganizationData: (state, action) => {
      state.organizationData = action.payload;
    },
    setSelectedBillingCycle: (state, action) => {
      state.selectedBillingCycle = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setActiveViewTab: (state, action) => {
      state.activeViewTab = action.payload;
    },
    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    setCheckoutModalOpen: (state, action) => {
      state.checkoutModalOpen = action.payload;
    },
    setSelectedPlanForCheckout: (state, action) => {
      state.selectedPlanForCheckout = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPlans,
  setCurrentSubscription,
  setInvoices,
  setUsageData,
  setActiveCoupons,
  setReferralData,
  setOrganizationData,
  setSelectedBillingCycle,
  setCurrency,
  setActiveViewTab,
  setAppliedCoupon,
  setCheckoutModalOpen,
  setSelectedPlanForCheckout,
  setStatus,
  setError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
