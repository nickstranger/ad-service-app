import { axiosInstance } from 'common/axios-instance';
import { strings } from 'common/strings';
import * as actionTypes from './auth.action-types';
import { AuthActionTypes } from './auth.types';
import { showErrorNotifier, showInfoNotifier } from '../notifier/notifier.actions';
import { UserRole } from 'entities/User';

const authSuccess = (
  token: string,
  authUserId: string,
  authUserRole: UserRole,
  authUsername: string
): AuthActionTypes => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: { authUserId, authUsername, authUserRole, token }
  };
};

export const authLogout = (): AuthActionTypes => {
  localStorage.removeItem('authUserId');
  localStorage.removeItem('authUsername');
  localStorage.removeItem('authUserRole');
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const authStateChecked = (): AuthActionTypes => {
  return {
    type: actionTypes.AUTH_STATE_CHECKED
  };
};

const checkAuthTimeout = (expirationTime: number) => {
  return (dispatch: any) => {
    // за 5 минут до автоматического логаута обновляем токен
    setTimeout(() => {
      dispatch(authRefresh());
    }, expirationTime - 5 * 60 * 1000);
  };
};

const authRefresh = () => {
  return async (dispatch: any) => {
    try {
      const response = await axiosInstance.get('/auth/refreshToken');

      const { accessToken, expiresIn, id, role, username } = response.data;

      setAuthDataToLocalStorage(accessToken, expiresIn, id, role, username);

      dispatch(authSuccess(accessToken, id, role, username));
      dispatch(checkAuthTimeout(expiresIn * 1000));
    } catch (error) {
      dispatch(authLogout());
    }
  };
};

export const auth = (
  username: string,
  password: string,
  setSubmitting: Function,
  setErrors: Function,
  backToPrevRoute: () => void
) => {
  return async (dispatch: any) => {
    const authData = {
      username: username,
      password: password
    };
    try {
      const response = await axiosInstance.post('/auth/login', authData);

      const { accessToken, expiresIn, id, role, username } = response.data;

      setAuthDataToLocalStorage(accessToken, expiresIn, id, role, username);

      setSubmitting(false);
      dispatch(authSuccess(accessToken, id, role, username));
      dispatch(checkAuthTimeout(expiresIn * 1000));
      dispatch(showInfoNotifier(strings.info.auth));
      backToPrevRoute();
    } catch (error) {
      setSubmitting(false);
      dispatch(showErrorNotifier(strings.error.auth, error));
      if (error.response?.data?.message) {
        setErrors(error.response.data.message);
      }
    }
  };
};

const setAuthDataToLocalStorage = (
  accessToken: string,
  expiresIn: number,
  id: string,
  role: UserRole,
  username: string
) => {
  const expirationDate = Number(new Date(new Date().getTime() + expiresIn * 1000));
  localStorage.setItem('authUserId', id);
  localStorage.setItem('authUsername', username);
  localStorage.setItem('authUserRole', role);
  localStorage.setItem('token', accessToken);
  localStorage.setItem('expirationDate', expirationDate.toString());
};

export const authCheckState = () => {
  return (dispatch: any) => {
    const authUserId = localStorage.getItem('authUserId');
    const authUsername = localStorage.getItem('authUsername');
    const authUserRole = localStorage.getItem('authUserRole');
    const token = localStorage.getItem('token');
    const expirationDate = Number(localStorage.getItem('expirationDate'));

    if (token && expirationDate && authUserId && authUserRole) {
      const now = new Date();
      const nowAsNumber = +now;
      const expirationDateAsNumber = +new Date(expirationDate);
      const expiresIn = new Date(expirationDate).getTime() - now.getTime();
      if (expirationDateAsNumber <= nowAsNumber) {
        // если срок токена истек, то логаут
        dispatch(authLogout());
      } else if (nowAsNumber > expirationDateAsNumber - expiresIn / 2) {
        // если срок токена не истек, но осталось меньше половины от срока, то рефрешим
        dispatch(authRefresh());
      } else {
        // тут ругается на то, что role может быть строкой, а функция принимает UserRole
        // не знаю как это исправить, поэтому игнор
        // @ts-ignore
        dispatch(authSuccess(token, authUserId, authUserRole, authUsername));
        dispatch(checkAuthTimeout(expiresIn));
        dispatch(showInfoNotifier(strings.info.auth));
      }
    } else {
      dispatch(authLogout());
    }

    dispatch(authStateChecked());
  };
};
