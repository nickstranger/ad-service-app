import { combineReducers } from 'redux';

import { pageReducer } from './page/page.reducer';
import { authReducer } from './auth/auth.reducer';
import { notifierReducer } from './notifier/notifier.reducer';

export const rootReducer = combineReducers({
  page: pageReducer,
  auth: authReducer,
  notifier: notifierReducer
});
