import React, { FC } from 'react';

import { useRoleStyles } from './Role.styles';
import { getRenderParamsByUserRole } from 'common/helpers';
import { UserRole } from 'entities/User';

type Props = {
  role: UserRole;
};

export const Role: FC<Props> = ({ role }) => {
  const classes = useRoleStyles();

  const [Icon, text] = getRenderParamsByUserRole(role);

  return (
    <div className={classes.root}>
      <Icon className={classes.icon} />
      {text}
    </div>
  );
};
