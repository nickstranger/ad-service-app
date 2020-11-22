import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BannerStatus } from '../enum';

@Schema()
export class Banner extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  placeholder: string;

  @Prop({ required: true })
  layout: string;

  @Prop({ type: Object, required: true })
  config: Record<string, unknown>;

  @Prop({ default: BannerStatus.ENABLED })
  status: BannerStatus;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);

export interface BannerHtml {
  placeholder: string;
  banner: string;
}
