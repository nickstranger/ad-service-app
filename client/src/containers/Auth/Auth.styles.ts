import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useAuthStyles = makeStyles((theme: Theme) =>
  createStyles({
    fieldset: {
      marginBottom: theme.spacing(3)
    }
  })
);
