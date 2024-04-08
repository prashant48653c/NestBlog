import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class loginDto {

    @IsNotEmpty()
    @IsString()

    @IsEmail({}, { message: "Please enter correct email" })
    readonly email: string;
    @MinLength(6)
    @IsNotEmpty()
    @IsString()

    readonly password: string;
}
