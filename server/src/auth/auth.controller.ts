import { Controller, Post, UseGuards, Logger, Headers, Get } from '@nestjs/common';

import { GetUser } from 'common/decorators';
import { User } from 'user/schema';
import { AuthService } from './auth.service';
import { Token } from './interfaces';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@GetUser() user: User): Promise<Token> {
    return await this.authService.login(user);
  }

  @Get('refreshToken')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Headers('Authorization') token: string): Promise<Token> {
    return await this.authService.refreshToken(token);
  }
}
