import { IsOptional, IsEnum, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

import { BannerResponseFormat } from '../enum';

export class BannerQueryDto {
  @IsOptional()
  @IsArray()
  @Transform((placeholders) => placeholders && placeholders.split(','))
  placeholders: string[];

  @IsOptional()
  @IsEnum(BannerResponseFormat)
  format: BannerResponseFormat;
}
