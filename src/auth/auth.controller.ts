import { Body, Controller, Delete, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import {  Response } from 'express';
 
import { User } from './schema/user.schema';
import { AccessTokenGuard } from '../guards/access-token.guard';

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
     
    ):Promise<any> {
      const data = await this.authService.login(req.user);
       
      console.log(data,"this is data ")
      return data
    }
  
 
    

    @Post('refreshaccesstoken')
   async refreshTokens(@Body() {REFRESHTOKEN}):Promise<{token:string}>{
    console.log("Route hitted")
        return await this.authService.refreshTokens({REFRESHTOKEN})
    }


    @Delete('logout')
async logOut(@Body('refreshToken') refreshToken: string, @Res() res: Response): Promise<any> {
     
  
    res.clearCookie('accesstoken', { path: '/' });

    res.clearCookie('refreshtoken', { path: '/' });

     
    await this.authService.logOut(refreshToken);

     
    return res.status(200).json({ message: 'Successfully logged out' });
}

    

}
