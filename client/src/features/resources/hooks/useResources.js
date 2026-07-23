import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchResourcesThunk, selectResources } from '../redux/index.js';

export const useResources = () => {
  const dispatch = useDispatch();
  const resources = useSelector(selectResources);

  useEffect(() => {
    if (resources.status === 'idle') {
      dispatch(fetchResourcesThunk());
    }
  }, [dispatch, resources.status]);

  return {
    ...resources,
    refetch: () => dispatch(fetchResourcesThunk())
  };
};
