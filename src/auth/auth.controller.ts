import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')  
export class AuthController {
    constructor(private authService:AuthService){}  //getting authserveice

    @Post('signup')
    signUp(@Body() signUpDto:signUpDto):Promise<{token:string}>{
        return this.authService.signUp(signUpDto)
    }

    @UseGuards(LocalAuthGuard)
    @Get('login')
    login(@Body() loginDto:loginDto):Promise<{token:string}>{
        return this.authService.login(loginDto)
    }
    

}
