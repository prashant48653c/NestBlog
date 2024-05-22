import { IsArray, IsEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/auth/schema/user.schema";

export class UpdateBlogDto {

    @IsOptional()
    @IsString()
    readonly _id:string;

    readonly head:string;
    readonly desc: string;

    readonly profilePic: string;

    readonly blogImg: string;


@IsArray()
@IsOptional()
@IsString({each:true})
    readonly tags: string[]

@IsEmpty({message:"You can't pass user id"})
    readonly user: User;


}