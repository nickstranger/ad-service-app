import { FC } from 'react';
import Toolbar from '@material-ui/core/Toolbar';

import { useMainContainerStyles } from './MainContainer.styles';

export const MainContainer: FC = ({ children }) => {
  const classes = useMainContainerStyles();
  return (
    <main className={classes.content}>
      <Toolbar />
      {children}
    </main>
  );
};
