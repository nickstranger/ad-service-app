import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { routes } from 'common/constants';
import { AdIcon } from 'components/CustomIcons/AdIcon';
import { useAppbarStyles } from './Appbar.styles';
import { Account } from '../Account/Account';

interface Props {
  isAuthenticated: boolean;
}

export const Appbar: FC<Props> = ({ isAuthenticated }) => {
  const classes = useAppbarStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <AdIcon className={classes.logo} />
        <Typography variant="h6" className={classes.title}>
          Рекламный сервис
        </Typography>
        {isAuthenticated ? <Account /> : null}
        <Button
          to={isAuthenticated ? routes.logout.path : routes.login.path}
          component={Link}
          color="inherit"
        >
          {isAuthenticated ? 'Выйти' : 'Войти'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
