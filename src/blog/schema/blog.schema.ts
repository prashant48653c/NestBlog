import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Mongoose } from "mongoose";
import { User } from "src/auth/schema/user.schema";



@Schema({
    timestamps:true
})
export class Blog {
    @Prop()
    head:string;

    @Prop()
    desc:string;
    @Prop()
    profilePic:string;
    @Prop()
    blogImg:string;
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    user:User;
    @Prop()
    tags:string[]
}

export const BLOGSCHEMA = SchemaFactory.createForClass(Blog)