import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';

import { useAccountStyles } from './Account.styles';
import { routes } from 'common/constants';
import { getRenderParamsByUserRole } from 'common/helpers';
import { RootState } from 'store/store';

export const Account = () => {
  const classes = useAccountStyles();
  const { authUserId, authUsername, authUserRole } = useSelector((state: RootState) => state.auth);

  let content = null;
  if (authUsername && authUserRole) {
    const [Icon, text] = getRenderParamsByUserRole(authUserRole);
    content = (
      <Link to={`${routes.users.path}/${authUserId}`} className={classes.root}>
        <Avatar className={classes.avatar}>
          <Icon />
        </Avatar>
        <div className={classes.info}>
          <div className={classes.username}>{authUsername}</div>
          <div className={classes.role}>{text}</div>
        </div>
      </Link>
    );
  }

  return content;
};
