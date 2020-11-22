import { Injectable, ValidationPipe } from '@nestjs/common';

import { ValidationGroupsEnum } from 'common/enum';
import { badRequestExceptionFactory } from './utils';

@Injectable()
export class ValidationCreatePipe extends ValidationPipe {
  constructor() {
    super({
      groups: [ValidationGroupsEnum.CREATE],
      exceptionFactory: badRequestExceptionFactory
    });
  }
}
