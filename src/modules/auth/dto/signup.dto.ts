import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, isString, MinLength, ValidateNested } from "class-validator";

export class signUpDto {
    @ApiProperty()

    @IsNotEmpty()
    @IsString()
    readonly username:string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty()

    @IsEmail({},{message:"Please enter correct email"})
    readonly email: string;
@MinLength(6)
@IsNotEmpty()
@IsString()
@ApiProperty()

    readonly password: string;
  

  

   

 

}