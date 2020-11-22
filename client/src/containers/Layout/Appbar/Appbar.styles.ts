import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useAppbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    logo: {
      marginRight: theme.spacing(),
      fontSize: '48px'
    },
    title: {
      flexGrow: 1
    }
  })
);
