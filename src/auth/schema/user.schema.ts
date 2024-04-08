import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({
    timestamps:true
})

export class User extends Document {


    @Prop()
    username:string;
    @Prop({})

    password:string;
    @Prop()

    desc:string;
    @Prop({unique:[true, 'Email already exist']})

    email:string;
}

export const USERSCHEMA= SchemaFactory.createForClass(User)