import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useMainContainerStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(5, 4)
    }
  })
);
