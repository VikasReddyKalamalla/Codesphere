import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTestsThunk, selectTests } from '../redux/index.js';

export const useTests = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectTests);

  useEffect(() => {
    if (state.status === 'idle') {
      dispatch(fetchTestsThunk());
    }
  }, [dispatch, state.status]);

  return { ...state, refetch: () => dispatch(fetchTestsThunk()) };
};
