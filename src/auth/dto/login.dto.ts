import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class loginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
  

    @IsEmail({}, { message: "Please enter correct email" })
    readonly email: string;
    @ApiProperty()
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
 

    readonly password: string;
}
