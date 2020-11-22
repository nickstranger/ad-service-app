import { AuthActionTypes, AuthState, AuthSuccessAction } from './auth.types';
import * as actionTypes from './auth.action-types';

const initialState: AuthState = {
  authUserId: null,
  authUsername: null,
  authUserRole: null,
  token: null,
  authStateChecked: false
};

const authSuccess = (state: AuthState, action: AuthSuccessAction): AuthState => {
  return {
    ...state,
    authUserId: action.payload.authUserId,
    authUsername: action.payload.authUsername,
    authUserRole: action.payload.authUserRole,
    token: action.payload.token
  };
};

const authLogout = (state: AuthState): AuthState => {
  return {
    ...state,
    authUserId: null,
    authUsername: null,
    authUserRole: null,
    token: null
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
