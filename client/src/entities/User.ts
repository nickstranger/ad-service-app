export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  READER = 'reader'
}

export enum UserStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled'
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
