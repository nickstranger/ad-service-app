import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isObjectId = Types.ObjectId.isValid(value);
    if (!isObjectId) {
      throw new BadRequestException('Validation failed (ObjectId string is expected)');
    }
    return value;
  }
}
