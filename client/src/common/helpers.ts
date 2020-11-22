import SvgIcon from '@material-ui/core/SvgIcon';
import StarIcon from '@material-ui/icons/Star';
import PersonIcon from '@material-ui/icons/Person';
import MenuBookIcon from '@material-ui/icons/MenuBook';

import { strings } from './strings';
import { UserRole } from 'entities/User';

export const getRenderParamsByUserRole = (role: UserRole): [typeof SvgIcon, string] => {
  switch (role) {
    case UserRole.ADMIN:
      return [StarIcon, strings.text.admin];
    case UserRole.USER:
      return [PersonIcon, strings.text.user];
    case UserRole.READER:
      return [MenuBookIcon, strings.text.reader];
  }
};

export const getRoleByString = (string: string): [UserRole, string] | null => {
  switch (string) {
    case UserRole.ADMIN:
      return [UserRole.ADMIN, strings.text.admin];
    case UserRole.USER:
      return [UserRole.USER, strings.text.user];
    case UserRole.READER:
      return [UserRole.READER, strings.text.reader];
    default:
      return null;
  }
};
