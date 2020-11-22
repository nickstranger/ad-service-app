import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'user/schema';
import { History, HistoryDocument } from './schema';
import { HistoryQueryDto } from './dto';
import { HistoryDocumentType } from './enum';

@Injectable()
export class HistoryService {
  private readonly logger = new Logger(HistoryService.name);

  constructor(@InjectModel(History.name) private historyModel: Model<HistoryDocument>) {}

  async findByCriteria(
    queryDto: HistoryQueryDto
  ): Promise<{ history: HistoryDocument[]; totalCount: number }> {
    const { documentType, id, offset, limit } = queryDto;

    const findConditions: { [p: string]: unknown } = {
      document_type: documentType
    };
    if (id) {
      findConditions.document_id = id;
    }

    const sortConditions = { changed_at: 'desc' };
    const skipConditions = offset || 0;
    const limitConditions = limit || 20;

    const getHistory = this.historyModel
      .find(findConditions)
      .sort(sortConditions)
      .skip(skipConditions)
      .limit(limitConditions)
      .exec();
    const getTotalCount = this.historyModel
      .countDocuments({
        document_type: documentType
      })
      .exec();

    const [history, totalCount] = await Promise.all([getHistory, getTotalCount]);

    return {
      history: history,
      totalCount: totalCount
    };
  }

  async addHistory(
    documentType: HistoryDocumentType,
    previousValue: { [p: string]: any },
    currentValue: { [p: string]: any },
    user: User
  ): Promise<void> {
    const history: History = {
      document_type: documentType,
      document_id: previousValue?._id || currentValue?._id,
      changed_at: new Date(),
      changer_id: user._id,
      changer_username: user.username,
      previous_value: previousValue,
      current_value: currentValue
    };
    const historyModel = new this.historyModel(history);
    try {
      await historyModel.save();
    } catch (err) {
      this.logger.error(
        `Failed on creating new History with data: ${JSON.stringify(history)}`,
        err
      );
      throw new InternalServerErrorException();
    }
  }
}
