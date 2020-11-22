import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useLoaderStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      margin: theme.spacing(5, 'auto', 0)
    }
  })
);
