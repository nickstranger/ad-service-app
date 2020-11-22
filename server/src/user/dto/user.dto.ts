import {
  IsString,
  IsEmail,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateIf
} from 'class-validator';

import { PASSWORD_REGEXP } from 'common/constants';
import { UserRole, UserStatus } from '../enum';
import { Match } from 'common/decorators';
import { ValidationGroupsEnum } from 'common/enum';

export class UserDto {
  @IsOptional({ groups: [ValidationGroupsEnum.UPDATE] })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  username: string;

  @IsOptional({ groups: [ValidationGroupsEnum.UPDATE] })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  @Matches(PASSWORD_REGEXP, {
    always: true,
    message:
      'Пароль должен быть от 8 до 20 символов и содержать как минимум 1 прописную букву и 1 цифру'
  })
  password: string;

  @ValidateIf((o) => o.password, { always: true })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  @Match('password', { message: 'Пароли не совпадают', always: true })
  repeat_password: string;

  @IsOptional({ groups: [ValidationGroupsEnum.UPDATE] })
  @IsEmail({}, { always: true })
  @IsNotEmpty({ always: true })
  email: string;

  @IsOptional({ always: true })
  @IsEnum(UserRole, { always: true })
  role: UserRole;

  @IsOptional({ always: true })
  @IsEnum(UserStatus, { always: true })
  status: UserStatus;
}
