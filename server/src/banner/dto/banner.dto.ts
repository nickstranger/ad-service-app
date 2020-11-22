import { IsString, IsOptional, IsEnum, IsNotEmpty, IsNotEmptyObject } from 'class-validator';

import { BannerStatus } from '../enum';
import { ValidationGroupsEnum } from 'common/enum';

export class BannerDto {
  @IsOptional({ groups: [ValidationGroupsEnum.UPDATE] })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  name: string;

  @IsOptional({ groups: [ValidationGroupsEnum.UPDATE] })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  placeholder: string;

  @IsOptional({ always: true })
  @IsEnum(BannerStatus, { always: true })
  status: BannerStatus;

  @IsOptional({ groups: [ValidationGroupsEnum.UPDATE] })
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  layout: string;

  @IsOptional({ groups: [ValidationGroupsEnum.UPDATE] })
  @IsNotEmptyObject({ always: true })
  config: Record<string, unknown>;
}
