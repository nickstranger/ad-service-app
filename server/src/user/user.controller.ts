import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';

import { ParseObjectIdPipe, ValidationCreatePipe, ValidationUpdatePipe } from 'common/pipes';
import { GetUser } from 'common/decorators';
import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'auth/decorators';
import { UserService } from './user.service';
import { User } from './schema';
import { UserRole } from './enum';
import { UserDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id', ParseObjectIdPipe) id: string): Promise<User> {
    this.logger.verbose(`Trying to get User with id: ${id}`);
    return await this.userService.findByIdOrFail(id);
  }

  @Post('create')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationCreatePipe)
  async createUser(@Body() userDto: UserDto, @GetUser() user: User): Promise<User> {
    this.logger.verbose(`Trying to create User with data: ${JSON.stringify(userDto)}`);
    return await this.userService.createUser(userDto, user);
  }

  @Patch('/:id')
  @UsePipes(ValidationUpdatePipe)
  async updateUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() userDto: UserDto,
    @GetUser() user: User
  ): Promise<User> {
    this.logger.verbose(`Trying to update User with data: ${JSON.stringify(userDto)}`);
    return await this.userService.updateUser(id, userDto, user);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  async deleteUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @GetUser() user: User
  ): Promise<void> {
    this.logger.verbose(`Trying to delete User with id: ${id}`);
    return await this.userService.deleteUser(id, user);
  }
}
