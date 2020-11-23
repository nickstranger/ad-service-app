import { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { routes } from 'common/constants';
import { strings } from 'common/strings';
import { UserRole } from 'entities/User';
import { RootState } from 'store/store';
import { showErrorNotifier } from 'store/notifier/notifier.actions';

interface PrivateRouteProps extends RouteProps {
  roles?: UserRole[];
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children, roles, ...rest }) => {
  const authUser = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        // если не залогинен
        if (!authUser.token) {
          return (
            <Redirect
              to={{
                pathname: routes.login.path,
                state: { from: location }
              }}
            />
          );
        }

        // если залогинен, но роль не подходит
        if (!authUser.authUserRole || (roles && !roles.includes(authUser.authUserRole))) {
          dispatch(showErrorNotifier(strings.error.forbiddenRole));
          return <Redirect to="/" />;
        }

        return children;
      }}
    />
  );
};
