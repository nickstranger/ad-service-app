import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';

import { useAppStyles } from 'App.styles';
import { Layout } from 'containers/Layout/Layout';
import { Routes } from 'router/Routes';
import { authCheckState } from 'store/auth/auth.actions';
import { RootState } from 'store/store';

const App = () => {
  const dispatch = useDispatch();
  const { authStateChecked } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(authCheckState());
  }, [dispatch]);

  const classes = useAppStyles();
  return authStateChecked ? (
    <div className={classes.root}>
      <CssBaseline />
      <Layout>
        <Routes />
      </Layout>
    </div>
  ) : null;
};

export default App;
