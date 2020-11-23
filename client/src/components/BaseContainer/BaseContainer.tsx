import { FC } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { useBaseContainerStyles } from './BaseContainer.styles';

interface Props {
  title: string;
  maxWidth?: string | number;
  minWidth?: string | number;
}

export const BaseContainer: FC<Props> = ({ children, title, maxWidth, minWidth }) => {
  const classes = useBaseContainerStyles({ maxWidth, minWidth });
  return (
    <Paper className={classes.paper} variant="elevation" elevation={2}>
      <Typography component="h1" variant="h5" color="primary" className={classes.title}>
        {title}
      </Typography>
      <Divider className={classes.divider} />
      {children}
    </Paper>
  );
};
