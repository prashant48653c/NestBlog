import { IsArray, IsEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/auth/schema/user.schema";

export class UpdateBlogDto {

    @IsOptional()
    @IsString()
    readonly _id:string;

    readonly head:string;
@IsOptional()

    readonly desc: string;
    @IsOptional()

    readonly profilePic: string;
    @IsOptional()

    readonly blogImg: string;


@IsArray()
@IsOptional()
@IsString({each:true})
    readonly tags: string[]

@IsOptional()
@IsEmpty({message:"You can't pass user id"})
    readonly user: User;
    @IsOptional()
    readonly refreshToken: string;


}