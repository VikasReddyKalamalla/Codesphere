import { useSelector, useDispatch } from 'react-redux';
import { fetchProfileThunk, updateProfileThunk, selectProfileState } from '../redux/index.js';

export const useProfile = () => {
  const dispatch = useDispatch();
  const profileState = useSelector(selectProfileState);

  const fetchProfile = (userId) => dispatch(fetchProfileThunk(userId));
  const updateProfile = (data) => dispatch(updateProfileThunk(data));

  return {
    ...profileState,
    fetchProfile,
    updateProfile
  };
};
