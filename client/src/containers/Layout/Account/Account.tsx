import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';

import { useAccountStyles } from './Account.styles';
import { routes } from 'common/constants';
import { getRenderParamsByUserRole } from 'common/helpers';
import { RootState } from 'store/store';

export const Account = () => {
  const classes = useAccountStyles();
  const { _id, username, role } = useSelector((state: RootState) => state.auth);

  const [Icon, text] = getRenderParamsByUserRole(role);

  return (
    <Link to={`${routes.users.path}/${_id}`} className={classes.root}>
      <Avatar className={classes.avatar}>
        <Icon />
      </Avatar>
      <div className={classes.info}>
        <div className={classes.username}>{username}</div>
        <div className={classes.role}>{text}</div>
      </div>
    </Link>
  );
};
