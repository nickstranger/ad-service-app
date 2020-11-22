import { SnackbarKey } from 'notistack';

import * as actionTypes from './notifier.action-types';
import { Notification } from 'entities/Notification';

export interface NotifierState {
  notifications: Notification[];
}

interface EnqueueNotifierAction {
  type: typeof actionTypes.ENQUEUE_NOTIFIER;
  notification: Notification;
}

interface CloseNotifierAction {
  type: typeof actionTypes.CLOSE_NOTIFIER;
  key: SnackbarKey;
}

interface RemoveNotifierAction {
  type: typeof actionTypes.REMOVE_NOTIFIER;
  key: SnackbarKey;
}
export type NotifierActionTypes =
  | EnqueueNotifierAction
  | CloseNotifierAction
  | RemoveNotifierAction;
