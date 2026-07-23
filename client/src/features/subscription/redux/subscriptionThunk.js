import {
  fetchPlansAPI,
  fetchCurrentSubscriptionAPI,
  createSubscriptionAPI,
  pauseSubscriptionAPI,
  resumeSubscriptionAPI,
  cancelSubscriptionAPI,
  fetchMyInvoicesAPI,
  fetchActiveCouponsAPI,
  fetchMyReferralsAPI,
  fetchUsageMetricsAPI,
  fetchMyOrganizationAPI,
} from '../services/subscriptionAPI';

import {
  setPlans,
  setCurrentSubscription,
  setInvoices,
  setUsageData,
  setActiveCoupons,
  setReferralData,
  setOrganizationData,
  setStatus,
  setError,
} from './subscriptionSlice';

export const loadSubscriptionDashboardThunk = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));

    const [plansRes, currentSubRes, usageRes, invoicesRes, couponsRes, referralsRes, orgRes] = await Promise.allSettled([
      fetchPlansAPI(),
      fetchCurrentSubscriptionAPI(),
      fetchUsageMetricsAPI(),
      fetchMyInvoicesAPI(),
      fetchActiveCouponsAPI(),
      fetchMyReferralsAPI(),
      fetchMyOrganizationAPI(),
    ]);

    if (plansRes.status === 'fulfilled' && plansRes.value.data) {
      dispatch(setPlans(plansRes.value.data));
    }
    if (currentSubRes.status === 'fulfilled' && currentSubRes.value.data) {
      dispatch(setCurrentSubscription(currentSubRes.value.data));
    }
    if (usageRes.status === 'fulfilled' && usageRes.value.data) {
      dispatch(setUsageData(usageRes.value.data));
    }
    if (invoicesRes.status === 'fulfilled' && invoicesRes.value.data) {
      dispatch(setInvoices(invoicesRes.value.data));
    }
    if (couponsRes.status === 'fulfilled' && couponsRes.value.data) {
      dispatch(setActiveCoupons(couponsRes.value.data));
    }
    if (referralsRes.status === 'fulfilled' && referralsRes.value.data) {
      dispatch(setReferralData(referralsRes.value.data));
    }
    if (orgRes.status === 'fulfilled' && orgRes.value.data) {
      dispatch(setOrganizationData(orgRes.value.data));
    }

    dispatch(setStatus('succeeded'));
  } catch (err) {
    console.error('Failed to load subscription dashboard data:', err);
    dispatch(setError(err.message));
    dispatch(setStatus('failed'));
  }
};

export const subscribeToPlanThunk = (payload) => async (dispatch) => {
  try {
    const res = await createSubscriptionAPI(payload);
    dispatch(setCurrentSubscription(res.data));
    const invoicesRes = await fetchMyInvoicesAPI();
    dispatch(setInvoices(invoicesRes.data || []));
    return res.data;
  } catch (err) {
    console.error('Subscription error:', err);
    throw err;
  }
};

export const pauseSubscriptionThunk = () => async (dispatch) => {
  try {
    const res = await pauseSubscriptionAPI();
    dispatch(setCurrentSubscription(res.data));
    return res.data;
  } catch (err) {
    console.error('Pause subscription error:', err);
    throw err;
  }
};

export const resumeSubscriptionThunk = () => async (dispatch) => {
  try {
    const res = await resumeSubscriptionAPI();
    dispatch(setCurrentSubscription(res.data));
    return res.data;
  } catch (err) {
    console.error('Resume subscription error:', err);
    throw err;
  }
};

export const cancelSubscriptionThunk = (reason) => async (dispatch) => {
  try {
    const res = await cancelSubscriptionAPI(reason);
    dispatch(loadSubscriptionDashboardThunk());
    return res;
  } catch (err) {
    console.error('Cancel subscription error:', err);
    throw err;
  }
};
