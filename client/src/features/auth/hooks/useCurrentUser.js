import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../redux/index.js';

export const useCurrentUser = () => {
  return useSelector(selectCurrentUser);
};
