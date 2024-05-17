import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')  
export class AuthController {
    constructor(private authService:AuthService){}  //getting authserveice

    @Post('signup')
   async signUp(@Body() signUpDto:signUpDto):Promise<{token:string}>{
        console.log("Signup dto ")
        return await this.authService.signUp(signUpDto)
    }

    @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    if (req.user) {
        const user=req.user
    const data = await this.authService.login(user);
    return data;
        }}
  
 

    @Get('refreshaccesstoken')
   async reFreshTokens(@Body() {ACCESSTOKEN,REFRESHTOKEN}):Promise<{token:string}>{
        return await this.authService.refreshTokens({ACCESSTOKEN,REFRESHTOKEN})
    }
    

}
