import { createStyles, makeStyles, Theme, fade } from '@material-ui/core/styles';

export const useAccountStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(6),
      color: theme.palette.common.white,
      textDecoration: 'none'
    },
    avatar: {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white
    },
    info: {
      display: 'flex',
      flexDirection: 'column',
      fontSize: '14px',
      lineHeight: 1.25
    },
    username: {
      fontWeight: 'bold'
    },
    role: {
      color: fade(theme.palette.common.white, 0.6)
    }
  })
);
