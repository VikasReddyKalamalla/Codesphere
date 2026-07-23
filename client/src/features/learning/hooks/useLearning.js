import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCoursesThunk, selectLearning } from '../redux/index.js';

export const useLearning = () => {
  const dispatch = useDispatch();
  const learning = useSelector(selectLearning);

  useEffect(() => {
    if (learning.status === 'idle') {
      dispatch(fetchCoursesThunk());
    }
  }, [dispatch, learning.status]);

  return {
    ...learning,
    refetch: () => dispatch(fetchCoursesThunk())
  };
};
