import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, loginThunk, registerThunk, googleAuthThunk, logoutThunk } from '../redux/index.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  const login = (creds) => dispatch(loginThunk(creds));
  const register = (data) => dispatch(registerThunk(data));
  const googleAuth = (user) => dispatch(googleAuthThunk(user));
  const logout = () => dispatch(logoutThunk());

  return {
    ...auth,
    login,
    register,
    googleAuth,
    logout
  };
};
