import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStatusStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    iconOn: {
      color: theme.palette.success.main,
      marginRight: theme.spacing(1)
    },
    iconOff: {
      color: theme.palette.error.main,
      marginRight: theme.spacing(1)
    }
  })
);
