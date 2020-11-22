import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import { ParseObjectIdPipe, ValidationCreatePipe, ValidationUpdatePipe } from 'common/pipes';
import { GetUser } from 'common/decorators';
import { JwtAuthGuard, RolesGuard } from 'auth/guards';
import { Roles } from 'auth/decorators';
import { UserRole } from 'user/enum';
import { User } from 'user/schema';
import { BannerService } from './banner.service';
import { Banner, BannerHtml } from './schema';
import { BannerDto, BannerQueryDto } from './dto';
import { BannerResponseFormat } from './enum';

@Controller('banners')
export class BannerController {
  private readonly logger = new Logger(BannerController.name);

  constructor(private bannerService: BannerService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findBanners(@Query() queryDto: BannerQueryDto): Promise<Banner[] | BannerHtml[]> {
    const { placeholders, format } = queryDto;
    let banners: Banner[];

    if (placeholders) {
      this.logger.verbose(`Trying to get Banners with placeholders: ${placeholders}`);
      banners = await this.bannerService.findByPlaceholders(placeholders);
    } else {
      this.logger.verbose(`Trying to get all Banners`);
      banners = await this.bannerService.findAll();
    }

    switch (format) {
      case BannerResponseFormat.HTML:
        return await this.bannerService.convertBannersToHtmlFormat(banners);
      case BannerResponseFormat.JSON:
      default:
        return banners;
    }
  }

  @Get('/:id')
  async findById(@Param('id', ParseObjectIdPipe) id: string): Promise<Banner> {
    this.logger.verbose(`Trying to get Banner with id: ${id}`);
    return await this.bannerService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationCreatePipe)
  async createBanner(@Body() bannerDto: BannerDto, @GetUser() user: User): Promise<Banner> {
    this.logger.verbose(`Trying to create Banner with data: ${JSON.stringify(bannerDto)}`);
    return await this.bannerService.createBanner(bannerDto, user);
  }

  @Patch('/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationUpdatePipe)
  async updateBanner(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() bannerDto: BannerDto,
    @GetUser() user: User
  ): Promise<Banner> {
    this.logger.verbose(`Trying to update Banner with data: ${JSON.stringify(bannerDto)}`);
    return await this.bannerService.updateBanner(id, bannerDto, user);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteBanner(
    @Param('id', ParseObjectIdPipe) id: string,
    @GetUser() user: User
  ): Promise<void> {
    this.logger.verbose(`Trying to delete Banner with id: ${id}`);
    return await this.bannerService.deleteBanner(id, user);
  }
}
