import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema({
    timestamps:true
})
export class Blog{
    @Prop()
    head:string;

    @Prop()
    desc:string;
    @Prop()
    profilePic:string;
    @Prop()
    blogImg:string;
    @Prop()
    authorName:string;
    @Prop()
    tags:string[]
}

export const BLOGSCHEMA = SchemaFactory.createForClass(Blog)