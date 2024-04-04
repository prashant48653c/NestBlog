import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateBlogDto {

    @IsOptional()
    @IsString()
    readonly head:string;
    readonly desc: string;

    readonly profilePic: string;

    readonly blogImg: string;

    readonly authorName: string;
@IsArray()
@IsOptional()
@IsString({each:true})
    readonly tags: string[]

}