import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSandboxItemsThunk, selectSandbox } from '../redux/index.js';

export const useSandbox = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectSandbox);

  useEffect(() => {
    if (state.status === 'idle') {
      dispatch(fetchSandboxItemsThunk());
    }
  }, [dispatch, state.status]);

  return { ...state, refetch: () => dispatch(fetchSandboxItemsThunk()) };
};
