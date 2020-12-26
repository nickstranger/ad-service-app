import { axiosInstance } from 'common/axios-instance';
import { strings } from 'common/strings';
import { UserRole } from 'entities/User';
import { showErrorNotifier, showInfoNotifier } from '../notifier/notifier.actions';
import * as actionTypes from './auth.action-types';
import { AuthActionTypes, AuthResponse } from './auth.types';

const authSuccess = (authData: AuthResponse): AuthActionTypes => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: authData
  };
};

export const authLogout = (): AuthActionTypes => {
  localStorage.removeItem('_id');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('accessToken');
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

const setRefreshTimeout = (expirationTime: number) => {
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
      const response = await axiosInstance.get<AuthResponse>('/auth/refreshToken');
      const { data } = response;
      setAuthDataToLocalStorage(data);

      dispatch(authSuccess(data));
      dispatch(setRefreshTimeout(data.expiresIn * 1000));
    } catch (error) {
      dispatch(authLogout());
    }
  };
};

export const auth = (
  username: string,
  password: string,
  setSubmitting: (isSubmitting: boolean) => void,
  backToPrevRoute: () => void
) => {
  return async (dispatch: any) => {
    const authData = {
      username: username,
      password: password
    };
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', authData);
      const { data } = response;
      setAuthDataToLocalStorage(data);

      setSubmitting(false);
      dispatch(authSuccess(data));
      dispatch(setRefreshTimeout(data.expiresIn * 1000));
      dispatch(showInfoNotifier(strings.info.auth));
      backToPrevRoute();
    } catch (error) {
      setSubmitting(false);
      dispatch(showErrorNotifier('Ошибка авторизации', error));
    }
  };
};

const setAuthDataToLocalStorage = (authData: AuthResponse) => {
  const { _id, username, role, accessToken, expiresIn } = authData;
  const expirationDate = Number(new Date(new Date().getTime() + expiresIn * 1000));
  localStorage.setItem('_id', _id);
  localStorage.setItem('username', username);
  localStorage.setItem('role', role);
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('expirationDate', expirationDate.toString());
};

export const authCheckState = () => {
  return (dispatch: any) => {
    const _id = localStorage.getItem('_id');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role') as UserRole;
    const accessToken = localStorage.getItem('accessToken');
    const expirationDate = Number(localStorage.getItem('expirationDate'));

    if (_id && username && role && accessToken && expirationDate) {
      const now = Number(new Date());
      const expiresIn = expirationDate - now;
      if (expirationDate <= now) {
        // если срок токена истек, то логаут
        dispatch(authLogout());
      } else if (now > expirationDate - 12 * 60 * 60 * 1000) {
        // если срок токена не истек, но осталось меньше 12 часов до истечения, то рефрешим
        dispatch(authSuccess({ _id, username, role, accessToken, expiresIn }));
        dispatch(authRefresh());
      } else {
        dispatch(authSuccess({ _id, username, role, accessToken, expiresIn }));
        dispatch(setRefreshTimeout(expiresIn));
        dispatch(showInfoNotifier(strings.info.auth));
      }
    } else {
      dispatch(authLogout());
    }

    dispatch(authStateChecked());
  };
};
