import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSessionsThunk, selectSessions } from '../redux/index.js';

export const useSessions = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectSessions);

  useEffect(() => {
    if (state.status === 'idle') {
      dispatch(fetchSessionsThunk());
    }
  }, [dispatch, state.status]);

  return { ...state, refetch: () => dispatch(fetchSessionsThunk()) };
};
