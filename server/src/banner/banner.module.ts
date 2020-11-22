import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HistoryModule } from 'history/history.module';
import { Banner, BannerSchema } from './schema';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    HistoryModule
  ],
  controllers: [BannerController],
  providers: [BannerService]
})
export class BannerModule {}
