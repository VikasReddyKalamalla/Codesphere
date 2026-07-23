import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCommunitiesThunk, selectCommunities } from '../redux/index.js';

export const useCommunity = () => {
  const dispatch = useDispatch();
  const communities = useSelector(selectCommunities);

  useEffect(() => {
    if (communities.status === 'idle') {
      dispatch(fetchCommunitiesThunk());
    }
  }, [dispatch, communities.status]);

  return {
    ...communities,
    refetch: () => dispatch(fetchCommunitiesThunk())
  };
};
