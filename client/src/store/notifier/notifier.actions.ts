import { SnackbarKey } from 'notistack';

import * as actionTypes from './notifier.action-types';
import { NotifierActionTypes } from './notifier.types';
import { NotifierVariants } from 'entities/Notification';

export const showSuccessNotifier = (message: string): NotifierActionTypes => {
  return enqueueNotifier(message, NotifierVariants.SUCCESS);
};

export const showErrorNotifier = (message: string, error?: any): NotifierActionTypes => {
  let complexMessage = message;
  if (typeof error?.response?.data?.message === 'string') {
    complexMessage = `${complexMessage}: ${error.response.data.message}`;
  } else if (typeof error?.message === 'string') {
    complexMessage = `${complexMessage}: ${error.message}`;
  }
  return enqueueNotifier(complexMessage, NotifierVariants.ERROR);
};

export const showInfoNotifier = (message: string): NotifierActionTypes => {
  return enqueueNotifier(message, NotifierVariants.INFO);
};

const enqueueNotifier = (message: string, variant: NotifierVariants): NotifierActionTypes => {
  return {
    type: actionTypes.ENQUEUE_NOTIFIER,
    notification: {
      message: message,
      variant: variant,
      key: new Date().getTime() + Math.random()
    }
  };
};

export const closeNotifier = (key: SnackbarKey): NotifierActionTypes => ({
  type: actionTypes.CLOSE_NOTIFIER,
  key: key
});

export const removeNotifier = (key: SnackbarKey): NotifierActionTypes => ({
  type: actionTypes.REMOVE_NOTIFIER,
  key: key
});
