import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'user/user.service';
import { User } from 'user/schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwtSecret')
    });
  }

  async validate(payload: Partial<User>): Promise<User> {
    const user = await this.userService.findByIdWithPassword(payload._id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isAuth =
      user.username === payload.username &&
      user.role === payload.role &&
      user.status === payload.status &&
      user.password === payload.password;
    if (!isAuth) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
