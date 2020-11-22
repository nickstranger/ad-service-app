import * as actionTypes from './notifier.action-types';
import { NotifierActionTypes, NotifierState } from './notifier.types';

const initialState: NotifierState = {
  notifications: []
};

export const notifierReducer = (state = initialState, action: NotifierActionTypes) => {
  switch (action.type) {
    case actionTypes.ENQUEUE_NOTIFIER:
      return {
        ...state,
        notifications: [...state.notifications, { ...action.notification }]
      };

    case actionTypes.CLOSE_NOTIFIER:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.key === action.key
            ? { ...notification, dismissed: true }
            : { ...notification }
        )
      };

    case actionTypes.REMOVE_NOTIFIER:
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.key !== action.key)
      };

    default:
      return state;
  }
};
