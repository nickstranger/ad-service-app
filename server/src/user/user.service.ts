import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CryptoService } from 'crypto/crypto.service';
import { HistoryDocumentType } from 'history/enum';
import { HistoryService } from 'history/history.service';
import { User } from './schema';
import { UserDto } from './dto/user.dto';
import { UserRole } from './enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly cryptoService: CryptoService,
    private readonly historyService: HistoryService
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  /** findById START
   * Набор методов для разных ситуаций
   * */
  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findByIdWithPassword(id: string): Promise<User> {
    return await this.userModel.findById(id).select('+password').exec();
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      this.logger.verbose(`User with id ${id} is not exists`);
      throw new NotFoundException(`User with id ${id} is not exists`);
    }

    return user;
  }

  async findByIdOrFailWithPassword(id: string): Promise<User> {
    const user = await this.findByIdWithPassword(id);

    if (!user) {
      this.logger.verbose(`User with id ${id} is not exists`);
      throw new NotFoundException(`User with id ${id} is not exists`);
    }

    return user;
  }
  /** findById END */

  /** findBy START
   * Набор методов для разных ситуаций
   * */
  async findOneBy(searchParams: Partial<User>): Promise<User> {
    return await this.userModel.findOne(searchParams).exec();
  }

  async findOneByWithPassword(searchParams: Partial<User>): Promise<User> {
    return await this.userModel.findOne(searchParams).select('+password').exec();
  }
  /** findBy END */

  async createUser(userDto: UserDto, userFromRequest: User): Promise<User> {
    await this.checkUsernameUniqueness(userDto.username);

    userDto.password = await this.cryptoService.hashPassword(userDto.password);
    userDto.role = userDto.role || UserRole.USER;

    const user = new this.userModel(userDto);
    try {
      const savedUser = await user.save();
      await this.historyService.addHistory(
        HistoryDocumentType.USER,
        null,
        savedUser,
        userFromRequest
      );
      return savedUser;
    } catch (err) {
      this.logger.error(`Failed on creating new User with data: ${JSON.stringify(userDto)}`, err);
      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: string, userDto: UserDto, userFromRequest: User): Promise<User> {
    const user = await this.findByIdOrFailWithPassword(id);
    const previousUser = JSON.parse(JSON.stringify(user));
    const { username, password, email, role, status } = userDto;

    const isAdmin = userFromRequest.role === UserRole.ADMIN;
    // дополнительно проверяем авторизацию действия для роли НЕ_АДМИН
    if (!isAdmin) {
      // редактирует ли он не себя самого
      const isSameUser = userFromRequest._id.toString() === user._id.toString();
      if (!isSameUser) {
        throw new UnauthorizedException();
      }
      // обновляет ли он поля, которые ему нельзя обновлять
      if (
        (username && user.username !== username) ||
        (role && user.role !== role) ||
        (status && user.status !== status)
      ) {
        throw new UnauthorizedException();
      }
    }

    // проверяем username на уникальность
    if (user.username !== username) {
      await this.checkUsernameUniqueness(username);
    }

    user.username = username ?? user.username;
    user.password = password ? await this.cryptoService.hashPassword(password) : user.password;
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    user.status = status ?? user.status;
    try {
      const savedUser = await user.save();
      await this.historyService.addHistory(
        HistoryDocumentType.USER,
        previousUser,
        savedUser,
        userFromRequest
      );
      return savedUser;
    } catch (err) {
      this.logger.error(`Failed on updating User with data: ${JSON.stringify(userDto)}`, err);
      throw new InternalServerErrorException();
    }
  }

  async deleteUser(id: string, userFromRequest: User): Promise<void> {
    const deleted = await this.userModel.findOneAndDelete({ _id: id }).exec();
    if (!deleted) {
      this.logger.verbose(`User with id ${id} is not exists`);
      throw new NotFoundException(`User with id ${id} is not exists`);
    }
    await this.historyService.addHistory(HistoryDocumentType.USER, deleted, null, userFromRequest);
  }

  async checkUsernameUniqueness(username: string): Promise<void> {
    const userWithSameUsername = await this.userModel.findOne({ username }).exec();
    if (userWithSameUsername) {
      this.logger.error('User with this username already exists');
      throw new ForbiddenException('User with this username already exists');
    }
  }
}
