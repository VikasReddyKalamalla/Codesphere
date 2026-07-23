import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardThunk, selectDashboard } from '../redux/index.js';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector(selectDashboard);

  useEffect(() => {
    if (dashboard.status === 'idle') {
      dispatch(fetchDashboardThunk());
    }
  }, [dispatch, dashboard.status]);

  return {
    ...dashboard,
    refetch: () => dispatch(fetchDashboardThunk())
  };
};
