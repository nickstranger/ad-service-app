import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useAppStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    }
  })
);
