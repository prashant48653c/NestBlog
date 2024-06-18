import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Mongoose } from "mongoose";
import { User } from "../../auth/schema/user.schema";
 



@Schema({
    timestamps:true
})
export class Blog {
    @Prop({type: String, required: [true, 'Heading is required']})
    head:string;

    @Prop({type: String, required: [true, 'Description is required']})
    desc:string;
    @Prop()
    profilePic:string;
    @Prop()
    blogImg:string;
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    user:User;
    @Prop({ required: [true, 'Tag is required']})
    tags:string[]
    _id:string
}

export const BLOGSCHEMA = SchemaFactory.createForClass(Blog)