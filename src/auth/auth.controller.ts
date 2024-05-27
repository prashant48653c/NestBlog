import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import {  Response } from 'express';
 
import { User } from './schema/user.schema';
import { AccessTokenGuard } from 'src/guards/access-token.guard';

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
  
 
    @UseGuards(AccessTokenGuard)

    @Post('refreshaccesstoken')
   async refreshTokens(@Body() {ACCESSTOKEN,REFRESHTOKEN}):Promise<{token:string}>{
    console.log("Route hitted")
        return await this.authService.refreshTokens({ACCESSTOKEN,REFRESHTOKEN})
    }


    @Get('logout')
    async logOut():Promise<{token:string}>{
        
         return await this.authService.logOut()
     }
    

}
