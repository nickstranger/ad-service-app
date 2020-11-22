import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useRoleStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(1)
    }
  })
);
