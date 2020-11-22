import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { User } from 'user/schema';
import { UserStatus } from 'user/enum';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.logger.error('Invalid username or password');
      throw new UnauthorizedException('Неверные имя пользователя или пароль');
    }
    if (user.status === UserStatus.DISABLED) {
      this.logger.error('User disabled');
      throw new UnauthorizedException('Пользователь был деактивирован ранее');
    }
    return user;
  }
}
