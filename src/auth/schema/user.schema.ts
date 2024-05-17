import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResolveTimestamps, Document, Model } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, trim: true })
  userName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: String, trim: true })
  desc: string;

  @Prop({ type: String, required: [true, 'Password is required'] })
  password: string;

  _id:string;
}

export const USERSCHEMA = SchemaFactory.createForClass(User).index({
  isEmailVerified: 1,
});
export type UsersDocument = User &
  ResolveTimestamps<Document, { timestamps: true }>;
export type UsersModel = Model<UsersDocument>;