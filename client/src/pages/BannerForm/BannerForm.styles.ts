import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useBannerFormStyles = makeStyles((_theme: Theme) =>
  createStyles({
    textarea: {
      width: '100%'
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  })
);
