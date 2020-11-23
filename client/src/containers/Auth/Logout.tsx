import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { authLogout } from 'store/auth/auth.actions';

export const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authLogout());
  }, [dispatch]);
  return <Redirect to="/" />;
};
