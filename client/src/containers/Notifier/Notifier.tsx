import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarKey, useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { Notification } from 'entities/Notification';
import { closeNotifier, removeNotifier } from 'store/notifier/notifier.actions';
import { RootState } from 'store/store';

let displayed: SnackbarKey[] = [];

const Notifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((store: RootState) => store.notifier.notifications || []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    notifications.forEach((notification: Notification) => {
      if (notification.dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(notification.key);
        return;
      }

      // do nothing if snackbar is already displayed
      if (displayed.includes(notification.key)) return;

      // display snackbar using notistack
      enqueueSnackbar(notification.message, {
        key: notification.key,
        variant: notification.variant,
        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
        onExited: (event, snackbarKey) => {
          // remove this snackbar from redux store
          dispatch(removeNotifier(snackbarKey));
          removeDisplayed(snackbarKey);
        },
        action: (snackbarKey) => (
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => dispatch(closeNotifier(snackbarKey))}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(notification.key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default Notifier;
