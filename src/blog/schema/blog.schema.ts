import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Model, Mongoose } from "mongoose";
import { User } from "src/auth/schema/user.schema";
import paginate from 'mongoose-paginate-v2';

export type BlogDocument = Blog & Document;

@Schema({
  timestamps: true,
})
export class Blog {
  @Prop()
  head: string;

  @Prop()
  desc: string;

  @Prop()
  profilePic: string;

  @Prop()
  blogImg: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop()
  tags: string[];
}

const BLOGSCHEMA = SchemaFactory.createForClass(Blog);

BLOGSCHEMA.plugin(paginate);

interface BlogData {}

const model = mongoose.model<
  BlogDocument,
  Model<BlogDocument, {}, BlogData>
>("Blogs", BLOGSCHEMA, "blogs");

export { model };