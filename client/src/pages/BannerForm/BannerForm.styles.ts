import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useBannerFormStyles = makeStyles((theme: Theme) =>
  createStyles({
    textarea: {
      width: '100%'
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
