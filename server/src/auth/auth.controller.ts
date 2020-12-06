import { Controller, Post, UseGuards, Headers, Get } from '@nestjs/common';

import { GetUser } from 'common/decorators';
import { User } from 'user/schema';
import { AuthService } from './auth.service';
import { AuthResponse } from './interfaces';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@GetUser() user: User): Promise<AuthResponse> {
    return await this.authService.login(user);
  }

  @Get('refreshToken')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Headers('Authorization') token: string): Promise<AuthResponse> {
    return await this.authService.refreshToken(token);
  }
}
