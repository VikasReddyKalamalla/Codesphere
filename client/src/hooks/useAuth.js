import { useSelector, useDispatch } from 'react-redux';
import { setAuth, clearAuth } from '../redux/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const login = (userData, token) => dispatch(setAuth({ user: userData, token }));
  const logout = () => dispatch(clearAuth());

  return { ...auth, login, logout };
};
