import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmpty, IsNotEmpty, IsOptional, IsString, isString, ValidateNested } from "class-validator";
import { Document } from "mongoose";
import { User } from "../../auth/schema/user.schema";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class createBlogDto  {
@ApiPropertyOptional()
    @IsOptional()
    readonly _id:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly head:string;
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    readonly desc: string;
    @IsOptional()
    @ApiProperty()

    readonly profilePic: string;
    @IsOptional()
    @ApiProperty()

    readonly blogImg: string;
    @ApiProperty()

    readonly authorName: string;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    @IsOptional()
    @ApiProperty()
    
    @IsString({ each: true })
    readonly tags: string[]


    @IsEmpty({message:"You can't pass user id"})
    readonly user: User;


}