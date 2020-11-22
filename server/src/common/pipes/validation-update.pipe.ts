import { Injectable, ValidationPipe } from '@nestjs/common';

import { ValidationGroupsEnum } from 'common/enum';
import { badRequestExceptionFactory } from './utils';

@Injectable()
export class ValidationUpdatePipe extends ValidationPipe {
  constructor() {
    super({
      groups: [ValidationGroupsEnum.UPDATE],
      exceptionFactory: badRequestExceptionFactory
    });
  }
}
