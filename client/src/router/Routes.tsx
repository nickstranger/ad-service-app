import { Redirect, Route, Switch } from 'react-router-dom';

import { routes } from 'common/constants';
import { PrivateRoute } from './PrivateRoute';
import { UserRole } from 'entities/User';
import { HistoryDocumentType } from 'entities/HistoryEntity';
import { BannerComponentVariant } from 'containers/BannerForm/BannerForm.types';
import { UserComponentVariant } from 'containers/UserForm/UserForm.types';
import { Auth } from 'containers/Auth/Auth';
import { Logout } from 'containers/Auth/Logout';
import { Banners } from 'containers/Banners/Banners';
import { BannerForm } from 'containers/BannerForm/BannerForm';
import { Users } from 'containers/Users/Users';
import { UserForm } from 'containers/UserForm/UserForm';
import { History } from 'containers/History/History';

export const Routes = () => {
  return (
    <Switch>
      <Route path={routes.login.path}>
        <Auth />
      </Route>
      <Route path={routes.logout.path}>
        <Logout />
      </Route>
      <PrivateRoute path={routes.banners.path} exact>
        <Banners />
      </PrivateRoute>
      <PrivateRoute path={routes.createBanner.path} roles={[UserRole.ADMIN, UserRole.USER]} exact>
        <BannerForm variant={BannerComponentVariant.CREATE} />
      </PrivateRoute>
      <PrivateRoute path={routes.bannersHistory.path}>
        <History
          tableTitle={`${routes.bannersHistory.name} баннеров`}
          documentType={HistoryDocumentType.BANNER}
        />
      </PrivateRoute>
      <PrivateRoute path={routes.banner.path}>
        <BannerForm variant={BannerComponentVariant.UPDATE} />
      </PrivateRoute>
      <PrivateRoute path={routes.users.path} exact>
        <Users />
      </PrivateRoute>
      <PrivateRoute path={routes.createUser.path} roles={[UserRole.ADMIN]}>
        <UserForm variant={UserComponentVariant.CREATE} />
      </PrivateRoute>
      <PrivateRoute path={routes.usersHistory.path}>
        <History
          tableTitle={`${routes.bannersHistory.name} пользователей`}
          documentType={HistoryDocumentType.USER}
        />
      </PrivateRoute>
      <PrivateRoute path={routes.user.path}>
        <UserForm variant={UserComponentVariant.UPDATE} />
      </PrivateRoute>
      <Redirect to={routes.banners.path} />
    </Switch>
  );
};
