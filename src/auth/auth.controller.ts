import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import {  Response } from 'express';
 
import { User } from './schema/user.schema';

@Controller('auth')  
export class AuthController {
    constructor(private authService:AuthService){}  //getting authserveice

    @Post('signup')
   async signUp(@Body() signUpDto:signUpDto):Promise<{token:string}>{
       
        return await this.authService.signUp(signUpDto)
    }
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async loginUser(
     
      @Req() req,
    ) {
      const data = await this.authService.login(req.user);
      return data;
    }
  
 

    @Get('refreshaccesstoken')
   async reFreshTokens(@Body() {ACCESSTOKEN,REFRESHTOKEN}):Promise<{token:string}>{
        return await this.authService.refreshTokens({ACCESSTOKEN,REFRESHTOKEN})
    }
    

}
