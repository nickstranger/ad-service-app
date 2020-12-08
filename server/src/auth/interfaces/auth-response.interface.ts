import { UserRole } from 'user/enum';

export interface AuthResponse {
  _id: string;
  username: string;
  role: UserRole;
  accessToken: string;
  expiresIn: number;
}
