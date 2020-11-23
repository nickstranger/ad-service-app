import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import PeopleIcon from '@material-ui/icons/People';

import { useSidebarStyles } from './Sidebar.styles';
import { SidebarListItem } from './SidebarListItem/SidebarListItem';
import { routes } from 'common/constants';
import { UserRole } from 'entities/User';
import { AdIcon } from 'components/CustomIcons/AdIcon';

interface Props {
  userRole: UserRole;
}

export const Sidebar: FC<Props> = ({ userRole }) => {
  const classes = useSidebarStyles();
  const curPath = useLocation().pathname;

  return (
    <Drawer
      variant="permanent"
      className={classes.sidebar}
      classes={{
        paper: classes.sidebarPaper
      }}
    >
      <Toolbar />
      <List component="nav">
        <SidebarListItem text="Баннеры">
          <AdIcon className={classes.listItemIcon} />
        </SidebarListItem>
        {userRole === UserRole.ADMIN || userRole === UserRole.USER ? (
          <SidebarListItem
            text={routes.createBanner.name}
            nested
            to={routes.createBanner.path}
            selected={curPath === routes.createBanner.path}
          />
        ) : null}
        <SidebarListItem
          text={routes.banners.name}
          nested
          to={routes.banners.path}
          selected={curPath === routes.banners.path}
        />
        <SidebarListItem
          text={routes.bannersHistory.name}
          nested
          to={routes.bannersHistory.path}
          selected={curPath === routes.bannersHistory.path}
        />
        <SidebarListItem text="Пользователи">
          <PeopleIcon className={classes.listItemIcon} />
        </SidebarListItem>
        {userRole === UserRole.ADMIN ? (
          <SidebarListItem
            text={routes.createUser.name}
            nested
            to={routes.createUser.path}
            selected={curPath === routes.createUser.path}
          />
        ) : null}
        <SidebarListItem
          text={routes.users.name}
          nested
          to={routes.users.path}
          selected={curPath === routes.users.path}
        />
        <SidebarListItem
          text={routes.usersHistory.name}
          nested
          to={routes.usersHistory.path}
          selected={curPath === routes.usersHistory.path}
        />
      </List>
    </Drawer>
  );
};
