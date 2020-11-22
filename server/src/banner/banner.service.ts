import * as fs from 'fs';
import * as handlebars from 'handlebars';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'user/schema';
import { HistoryDocumentType } from 'history/enum';
import { HistoryService } from 'history/history.service';
import { BannerStatus } from './enum';
import { Banner, BannerHtml } from './schema';
import { BannerDto } from './dto';

@Injectable()
export class BannerService {
  private readonly logger = new Logger(BannerService.name);

  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<Banner>,
    private readonly historyService: HistoryService
  ) {}

  async findAll(): Promise<Banner[]> {
    return await this.bannerModel.find().exec();
  }

  async findByPlaceholders(placeholders: string[]): Promise<Banner[]> {
    return await this.bannerModel
      .find({
        placeholder: { $in: [...placeholders] },
        status: BannerStatus.ENABLED
      })
      .exec();
  }

  async findById(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id).exec();
    if (!banner) {
      this.logger.verbose(`Banner with id ${id} is not exists`);
      throw new NotFoundException(`Banner with id ${id} is not exists`);
    }

    return banner;
  }

  async findOneBy(searchParams: Partial<Banner>): Promise<Banner> {
    const banner = await this.bannerModel.findOne(searchParams).exec();
    if (!banner) {
      this.logger.verbose(`Banner with ${JSON.stringify(searchParams)} is not exists`);
      throw new NotFoundException(`Banner with ${JSON.stringify(searchParams)} is not exists`);
    }

    return banner;
  }

  async createBanner(bannerDto: BannerDto, user: User): Promise<Banner> {
    const banner = new this.bannerModel(bannerDto);
    try {
      const savedBanner = await banner.save();
      await this.historyService.addHistory(HistoryDocumentType.BANNER, null, savedBanner, user);
      return savedBanner;
    } catch (err) {
      this.logger.error(
        `Failed on creating new Banner with data: ${JSON.stringify(bannerDto)}`,
        err
      );
      throw new InternalServerErrorException();
    }
  }

  async updateBanner(id: string, bannerDto: BannerDto, user: User): Promise<Banner> {
    const banner = await this.findById(id);
    const previousBanner = JSON.parse(JSON.stringify(banner));
    const { name, placeholder, status, layout, config } = bannerDto;
    banner.name = name ?? banner.name;
    banner.status = status ?? banner.status;
    banner.placeholder = placeholder ?? banner.placeholder;
    banner.layout = layout ?? banner.layout;
    banner.config = config ?? banner.config;
    try {
      const savedBanner = await banner.save();
      await this.historyService.addHistory(
        HistoryDocumentType.BANNER,
        previousBanner,
        savedBanner,
        user
      );
      return savedBanner;
    } catch (err) {
      this.logger.error(`Failed on updating Banner with data: ${JSON.stringify(bannerDto)}`, err);
      throw new InternalServerErrorException();
    }
  }

  async deleteBanner(id: string, user: User): Promise<void> {
    const deleted = await this.bannerModel.findOneAndDelete({ _id: id }).exec();
    if (!deleted) {
      this.logger.verbose(`Banner with id ${id} is not exists`);
      throw new NotFoundException(`Banner with id ${id} is not exists`);
    }
    await this.historyService.addHistory(HistoryDocumentType.BANNER, deleted, null, user);
  }

  async convertBannersToHtmlFormat(banners: Banner[]): Promise<BannerHtml[]> {
    try {
      return await this.renderBanners(banners);
    } catch (err) {
      this.logger.error(`Failed on rendering Banners`, err);
      throw new InternalServerErrorException();
    }
  }

  private renderBanners(banners: Banner[]): Promise<BannerHtml[]> {
    return new Promise((resolve, reject) => {
      fs.readFile('./dist/views/banner.handlebars', { encoding: 'utf8' }, (error, fileData) => {
        if (error) return reject();
        handlebars.registerHelper('json', (context) => {
          return JSON.stringify(context);
        });
        const template = handlebars.compile(fileData, { noEscape: true });
        const result = banners.map((banner) => {
          return {
            placeholder: banner.placeholder,
            banner: template(banner, {
              allowProtoPropertiesByDefault: true
            })
          };
        });
        resolve(result);
      });
    });
  }
}
