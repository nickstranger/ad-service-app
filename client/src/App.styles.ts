import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useAppStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
    }
  })
);
