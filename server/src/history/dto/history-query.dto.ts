import { IsOptional, IsMongoId, IsNumber, IsEnum, IsDefined } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

import { HistoryDocumentType } from '../enum';

export class HistoryQueryDto {
  @IsDefined()
  @IsEnum(HistoryDocumentType)
  documentType: HistoryDocumentType;

  @IsOptional()
  @IsMongoId()
  id: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value))
  offset: number;

  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value))
  limit: number;
}
