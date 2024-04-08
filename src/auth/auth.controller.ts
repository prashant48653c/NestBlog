import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';

@Controller('auth')  
export class AuthController {
    constructor(private authService:AuthService){}  //getting authserveice

    @Post('signup')
    signUp(@Body() signUpDto:signUpDto):Promise<{token:string}>{
        return this.authService.signUp(signUpDto)
    }

    @Get('login')
    login(@Body() loginDto:loginDto):Promise<{token:string}>{
        return this.authService.login(loginDto)
    }
    

}
