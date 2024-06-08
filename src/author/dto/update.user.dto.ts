import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class updateUserDto {


    @IsString()
    readonly id: string;

    @IsOptional()
    @IsString()

    readonly username: string;
    @IsOptional()
    @IsString()

    readonly desc: string;

}
