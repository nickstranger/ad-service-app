import {
  Controller,
  Get,
  Logger,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards';
import { HistoryDocument } from './schema';
import { HistoryService } from './history.service';
import { HistoryQueryDto } from './dto';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(private historyService: HistoryService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findByCriteria(
    @Query() queryDto: HistoryQueryDto
  ): Promise<{ history: HistoryDocument[]; totalCount: number }> {
    return await this.historyService.findByCriteria(queryDto);
  }
}
