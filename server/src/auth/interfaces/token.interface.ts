import { UserRole } from 'user/enum';

export interface Token {
  accessToken: string;
  expiresIn: number;
  id: string;
  username: string;
  role: UserRole;
}
