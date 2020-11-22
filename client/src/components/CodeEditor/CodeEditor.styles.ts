import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useCodeEditorStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      color: theme.palette.error.main
    }
  })
);
