import * as actionTypes from './auth.action-types';
import { UserRole } from 'entities/User';

export interface AuthResponse {
  _id: string;
  username: string;
  role: UserRole;
  accessToken: string;
  expiresIn: number;
}

export interface AuthState extends AuthResponse {
  authStateChecked: boolean;
}

export interface AuthSuccessAction {
  type: typeof actionTypes.AUTH_SUCCESS;
  payload: AuthResponse;
}

interface AuthLogoutAction {
  type: typeof actionTypes.AUTH_LOGOUT;
}

export interface AuthStateCheckedAction {
  type: typeof actionTypes.AUTH_STATE_CHECKED;
}

export type AuthActionTypes = AuthSuccessAction | AuthLogoutAction | AuthStateCheckedAction;
