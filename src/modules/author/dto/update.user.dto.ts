import { Prop } from "@nestjs/mongoose";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class updateUserDto {

    @ApiProperty()

    @IsString()
    readonly id: string;
    @ApiProperty()
    @IsOptional()
    @IsString()
   

    readonly username: string;
    @IsOptional()
    @IsString()
    @ApiPropertyOptional()

    readonly desc: string;

}
