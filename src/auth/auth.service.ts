import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { AUTH_UTILITY } from './utility/auth.utility';
import { validateType } from './types/helper';


@Injectable()



export class AuthService {
constructor(
@InjectModel(User.name)
private Usermodel:Model<User>,   //it's like passing Usermodel
private JwtService:JwtService   //passing jwtservice
){}

   

async signUp(signUpDto:signUpDto):Promise<{token:string,refreshToken:string}>{

const {username,email,password}=signUpDto

const HashPassword= await AUTH_UTILITY.hashPassword(password);
const user=await this.Usermodel.create({username,email,password:HashPassword})
const token= this.JwtService.sign({_id:user._id},{expiresIn:'10m'})
const refreshToken=this.JwtService.sign({_id:user._id})

await this.Usermodel.updateOne(
    { _id: user._id },
    { $set: { refreshToken } }
  );
  



return {token,refreshToken}
}



async login(user: User): Promise<any> {
  return user;
}



async validateUser(loginData:validateType){
const {email,password}=loginData
 
const isUser=await this.Usermodel.findOne({email:email.toLowerCase()})
if(!isUser){
    
throw new UnauthorizedException('Invalid email ')
}
const isRightPassword= await AUTH_UTILITY.comparePasswords(password,isUser.password)

if(!isRightPassword){
throw new UnauthorizedException('Wrong Password')
}
 
 return isUser
}

async refreshTokens({ACCESSTOKEN,REFRESHTOKEN}):Promise<any>{
    
    const User=await this.Usermodel.findOne({refreshToken:REFRESHTOKEN})
     if(!User){
      throw new UnauthorizedException('Invalid refresh token')
     }
     
     const newAccessToken=this.JwtService.sign({_id:User._id},{expiresIn:'10m'})
     return {newAccessToken}
    }
    

}
