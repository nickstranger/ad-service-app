import { SnackbarKey } from 'notistack';

export enum NotifierVariants {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
}

export interface Notification {
  message: string;
  key: SnackbarKey;
  variant: NotifierVariants;
  dismissed?: boolean;
}
