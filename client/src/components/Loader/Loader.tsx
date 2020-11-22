import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useLoaderStyles } from './Loader.styles';

export const Loader = () => {
  const classes = useLoaderStyles();
  return <CircularProgress className={classes.root} size={200} />;
};
