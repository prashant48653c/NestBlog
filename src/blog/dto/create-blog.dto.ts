import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsString, isString, ValidateNested } from "class-validator";

export class createBlogDto {

    @IsNotEmpty()
    @IsString()
    readonly head:string;
    readonly desc: string;

    readonly profilePic: string;

    readonly blogImg: string;

    readonly authorName: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    @ValidateNested({ each: true })
    @IsString({ each: true })
    readonly tags: string[]

}