import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWorkspacesThunk, selectCodex } from '../redux/index.js';

export const useWorkspace = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectCodex);

  useEffect(() => {
    if (state.status === 'idle') {
      dispatch(fetchWorkspacesThunk());
    }
  }, [dispatch, state.status]);

  return { ...state, refetch: () => dispatch(fetchWorkspacesThunk()) };
};
