import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventsThunk, selectEvents } from '../redux/index.js';

export const useEvents = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectEvents);

  useEffect(() => {
    if (state.status === 'idle') {
      dispatch(fetchEventsThunk());
    }
  }, [dispatch, state.status]);

  return { ...state, refetch: () => dispatch(fetchEventsThunk()) };
};
