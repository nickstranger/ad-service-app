import { UserRole } from 'entities/User';
import { AuthActionTypes, AuthState, AuthSuccessAction } from './auth.types';
import * as actionTypes from './auth.action-types';

const initialState: AuthState = {
  _id: '',
  username: '',
  role: UserRole.GUEST,
  accessToken: '',
  expiresIn: 0,
  authStateChecked: false
};

const authSuccess = (state: AuthState, action: AuthSuccessAction): AuthState => {
  return {
    ...state,
    ...action.payload
  };
};

const authLogout = (state: AuthState): AuthState => {
  return {
    ...state,
    ...initialState,
    authStateChecked: true
  };
};

const authStateChecked = (state: AuthState): AuthState => {
  return {
    ...state,
    authStateChecked: true
  };
};

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state);
    case actionTypes.AUTH_STATE_CHECKED:
      return authStateChecked(state);
    default:
      return state;
  }
};
