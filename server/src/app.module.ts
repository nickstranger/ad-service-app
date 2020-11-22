import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { config } from 'config/config';
import { MongooseConfig } from 'config/database.config';
import { AuthModule } from 'auth/auth.module';
import { CryptoModule } from 'crypto/crypto.module';
import { UserModule } from 'user/user.module';
import { BannerModule } from 'banner/banner.module';
import { HistoryModule } from 'history/history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*']
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfig
    }),
    AuthModule,
    CryptoModule,
    UserModule,
    BannerModule,
    HistoryModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
