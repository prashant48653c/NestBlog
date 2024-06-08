import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, isString, MinLength, ValidateNested } from "class-validator";

export class signUpDto {

    @IsNotEmpty()
    @IsString()
    readonly username:string;
    @IsNotEmpty()
    @IsString()

    @IsEmail({},{message:"Please enter correct email"})
    readonly email: string;
@MinLength(6)
@IsNotEmpty()
@IsString()

    readonly password: string;
  

  

   

 

}