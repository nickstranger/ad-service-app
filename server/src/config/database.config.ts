import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

import { DatabaseConfig } from './config.interface';

@Injectable()
export class MongooseConfig implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    const databaseConfig = this.configService.get<DatabaseConfig>('database');
    const { username, password, host, port, database, uri } = databaseConfig;

    const collectedUri =
      `mongodb://` +
      (username && password ? `${username}:${password}@` : '') +
      `${host}:${port}/${database}?authSource=admin`;

    return {
      uri: uri || collectedUri
    };
  }
}
