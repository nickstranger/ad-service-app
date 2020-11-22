import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HistoryDocumentType } from '../enum';

export type HistoryDocument = History & Document;

@Schema()
export class History {
  @Prop({ required: true })
  document_type: HistoryDocumentType;

  @Prop({ required: true })
  document_id: Types.ObjectId;

  @Prop({ required: true })
  changed_at: Date;

  @Prop({ required: true })
  changer_id: Types.ObjectId;

  @Prop({ required: true })
  changer_username: string;

  @Prop({ type: Object, default: null })
  previous_value: Record<string, unknown>;

  @Prop({ type: Object, default: null })
  current_value: Record<string, unknown>;
}

export const HistorySchema = SchemaFactory.createForClass(History);
