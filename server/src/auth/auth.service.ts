import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'user/user.service';
import { User } from 'user/schema';
import { CryptoService } from 'crypto/crypto.service';
import { AuthResponse } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly cryptoService: CryptoService
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneByWithPassword({ username: username });
    if (!user) {
      return null;
    }

    const validPassword = await this.cryptoService.checkPassword(password, user.password);
    if (!validPassword) {
      return null;
    }

    return user;
  }

  async login(user: User): Promise<AuthResponse> {
    const { _id, username, role, status, password } = user;
    return {
      _id,
      username,
      role,
      accessToken: this.jwtService.sign({ _id, username, role, status, password }),
      expiresIn: this.configService.get<number>('jwtExpiration')
    };
  }

  async refreshToken(previousToken: string): Promise<AuthResponse> {
    const previousTokenPure = previousToken.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(previousTokenPure);
    if (typeof decodedToken !== 'object') {
      this.logger.error('Failed on refreshing token');
      throw new InternalServerErrorException();
    } else {
      delete decodedToken.iat;
      delete decodedToken.exp;

      return {
        _id: decodedToken._id,
        username: decodedToken.username,
        role: decodedToken.role,
        accessToken: this.jwtService.sign(decodedToken),
        expiresIn: this.configService.get<number>('jwtExpiration')
      };
    }
  }
}
