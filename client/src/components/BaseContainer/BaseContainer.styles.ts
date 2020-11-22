import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface Props {
  maxWidth?: string | number;
  minWidth?: string | number;
}

export const useBaseContainerStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: (props: Props) => ({
      margin: '0 auto',
      maxWidth: props.maxWidth || 'none',
      minWidth: props.minWidth || 'auto',
      padding: theme.spacing(5)
    }),
    title: {
      marginBottom: theme.spacing(1)
    },
    divider: {
      marginBottom: theme.spacing(3)
    }
  })
);
