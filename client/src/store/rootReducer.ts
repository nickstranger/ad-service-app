import { combineReducers } from 'redux';

import { authReducer } from './auth/auth.reducer';
import { notifierReducer } from './notifier/notifier.reducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  notifier: notifierReducer
});
