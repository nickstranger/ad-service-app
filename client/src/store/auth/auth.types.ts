import * as actionTypes from './auth.action-types';
import { UserRole } from 'entities/User';

export interface AuthState {
  authUserId: string | null;
  authUsername: string | null;
  authUserRole: UserRole | null;
  token: string | null;
  authStateChecked: boolean;
}

export interface AuthSuccessAction {
  type: typeof actionTypes.AUTH_SUCCESS;
  payload: {
    authUserId: string;
    authUsername: string;
    authUserRole: UserRole;
    token: string;
  };
}

interface AuthLogoutAction {
  type: typeof actionTypes.AUTH_LOGOUT;
}

export interface AuthStateCheckedAction {
  type: typeof actionTypes.AUTH_STATE_CHECKED;
}

export type AuthActionTypes = AuthSuccessAction | AuthLogoutAction | AuthStateCheckedAction;
