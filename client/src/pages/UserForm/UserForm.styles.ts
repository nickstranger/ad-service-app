import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useUserStyles = makeStyles((theme: Theme) =>
  createStyles({
    fieldset: {
      marginBottom: theme.spacing(3)
    },
    actions: {
      '& > *': {
        marginRight: theme.spacing(1),
        '&:last-child': {
          marginRight: 0
        }
      }
    }
  })
);
