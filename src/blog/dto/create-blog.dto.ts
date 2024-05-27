import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmpty, IsNotEmpty, IsOptional, IsString, isString, ValidateNested } from "class-validator";
import { Document } from "mongoose";
import { User } from "src/auth/schema/user.schema";

export class createBlogDto  {

    @IsOptional()
    readonly _id:string;

    @IsNotEmpty()
    @IsString()
    readonly head:string;
    @IsNotEmpty()
    @IsString()
    readonly desc: string;
    @IsOptional()

    readonly profilePic: string;
    @IsOptional()

    readonly blogImg: string;

    readonly authorName: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    @IsOptional()
    
    @IsString({ each: true })
    readonly tags: string[]


    @IsEmpty({message:"You can't pass user id"})
    readonly user: User;


}