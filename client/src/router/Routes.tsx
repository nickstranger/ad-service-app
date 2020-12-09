import { Redirect, Route, Switch } from 'react-router-dom';

import { routes } from 'common/constants';
import { PrivateRoute } from './PrivateRoute';
import { UserRole } from 'entities/User';
import { HistoryDocumentType } from 'entities/HistoryEntity';
import { BannerComponentVariant } from 'pages/BannerForm/BannerForm.types';
import { UserComponentVariant } from 'pages/UserForm/UserForm.types';
import { Auth } from 'pages/Auth/Auth';
import { Logout } from 'pages/Auth/Logout';
import { Banners } from 'pages/Banners/Banners';
import { BannerForm } from 'pages/BannerForm/BannerForm';
import { Users } from 'pages/Users/Users';
import { UserForm } from 'pages/UserForm/UserForm';
import { History } from 'pages/History/History';

// WARNING!
//
// На некоторых компонентах проставлен проперти key.
// Это сделано для того, чтобы принудительно сбрасывать стейт функционального компонента.
//
// Например, компонент History с разными пропертями используется в двух роутах. При переходе между этими двумя роутами стейт
// остается прежним из-за внутренней оптимизации React.
// Может получиться конфуз, если при переходе по роуту данные в таблице остались старыми (если, например, проблемы с сетью).
//
// Есть два способа решить проблему: установка key и принудительный сброс стейта внутри компонента в useEffect хуке.
// Выбран первый вариант, т.к. в этом случае не нужно задумываться на тем, сбросил ли я все стейты.
// Может влиять на производительность, но в данном случае, ввиду малого размера приложения, решил пренебречь.

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
        <BannerForm variant={BannerComponentVariant.CREATE} key={BannerComponentVariant.CREATE} />
      </PrivateRoute>
      <PrivateRoute path={routes.bannersHistory.path}>
        <History
          tableTitle={`${routes.bannersHistory.name} баннеров`}
          documentType={HistoryDocumentType.BANNER}
          key={HistoryDocumentType.BANNER}
        />
      </PrivateRoute>
      <PrivateRoute path={routes.banner.path}>
        <BannerForm variant={BannerComponentVariant.UPDATE} key={BannerComponentVariant.UPDATE} />
      </PrivateRoute>
      <PrivateRoute path={routes.users.path} exact>
        <Users />
      </PrivateRoute>
      <PrivateRoute path={routes.createUser.path} roles={[UserRole.ADMIN]}>
        <UserForm variant={UserComponentVariant.CREATE} key={UserComponentVariant.CREATE} />
      </PrivateRoute>
      <PrivateRoute path={routes.usersHistory.path}>
        <History
          tableTitle={`${routes.bannersHistory.name} пользователей`}
          documentType={HistoryDocumentType.USER}
          key={HistoryDocumentType.USER}
        />
      </PrivateRoute>
      <PrivateRoute path={routes.user.path}>
        <UserForm variant={UserComponentVariant.UPDATE} key={UserComponentVariant.UPDATE} />
      </PrivateRoute>
      <Redirect to={routes.banners.path} />
    </Switch>
  );
};
