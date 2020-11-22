import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserRole, UserStatus } from '../enum';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: UserRole.USER })
  role: UserRole;

  @Prop({ default: UserStatus.ENABLED })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
