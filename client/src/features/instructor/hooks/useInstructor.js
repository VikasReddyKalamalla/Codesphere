import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInstructorStatsThunk, selectInstructor } from '../redux/index.js';

export const useInstructor = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectInstructor);

  useEffect(() => {
    if (state.status === 'idle') {
      dispatch(fetchInstructorStatsThunk());
    }
  }, [dispatch, state.status]);

  return { ...state, refetch: () => dispatch(fetchInstructorStatsThunk()) };
};
