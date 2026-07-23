import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminStatsThunk, selectAdmin } from '../redux/index.js';

export const useAdmin = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectAdmin);

  useEffect(() => {
    if (state.status === 'idle') {
      dispatch(fetchAdminStatsThunk());
    }
  }, [dispatch, state.status]);

  return { ...state, refetch: () => dispatch(fetchAdminStatsThunk()) };
};
