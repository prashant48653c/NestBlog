import { Body, Controller, Delete, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';
import { createMocks } from 'node-mocks-http';
import { User } from './schema/user.schema';
import { AccessTokenGuard } from '../../guards/access-token.guard';
import { loginType, returnedTokenType, signUpType } from './types/types';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("Authentication")
export class AuthController {
  constructor(private authService: AuthService) { }  //getting authserveice

  @Post('signup')
  @ApiOperation({ summary: 'SignUp a new user' })
  @ApiResponse({ status: 200, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
 

  async signUp(@Body() signUpDto: signUpDto): Promise<signUpType> {

    return await this.authService.signUp(signUpDto)
  }



  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User Not Found' })

  async loginUser(

    @Req() req,
    @Body()loginDto:loginDto

  ): Promise<loginType> {
    const data = await this.authService.login(req.user);

    console.log(data, "this is data ")
    return data
  }




  @Post('refreshaccesstoken')
  @ApiOperation({ summary: 'Get new access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Access and Refresh token are regenerated' })
  @ApiResponse({ status: 401, description: 'Unauthorized : Invalid refresh token' })
 

  async refreshTokens(@Body() { REFRESHTOKEN }): Promise<returnedTokenType> {
    console.log("Route hitted")
    return await this.authService.refreshTokens({ REFRESHTOKEN })
  }

  @ApiSecurity("Jwt-Auth")
  @UseGuards(AccessTokenGuard)
  @Delete('logout')
  @ApiOperation({ summary: 'Logout the user' })
  @ApiResponse({ status: 200, description: 'Logout successfull' })
  @ApiResponse({ status: 401, description: ' Invalid refresh token' })
 

  async logOut(@Body('refreshToken') refreshToken: string, @Res() res: Response): Promise<any> {


    res.clearCookie('accesstoken', { path: '/' });
    res.clearCookie('refreshtoken', { path: '/' });
  const result=  await this.authService.logOut(refreshToken);
    return res.status(200).json(result);
  }



}
