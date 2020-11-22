import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';

interface Props extends DialogProps {
  title: string;
  content: string;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const ConfirmationDialog: FC<Props> = ({
  title,
  content,
  handleConfirm,
  handleCancel,
  ...rest
}) => {
  return (
    <Dialog onClose={handleCancel} {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Отмена
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
