import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
constructor(
@InjectModel(User.name)
private Usermodel:Model<User>,   //it's like passing Usermodel
private JwtService:JwtService   //passing jwtservice
){}

   

async signUp(signUpDto:signUpDto):Promise<{token:string}>{

const {username,email,password}=signUpDto

const HashPassword=await bcrypt.hash(password,10)
const user=await this.Usermodel.create({username,email,password:HashPassword})


const token=this.JwtService.sign({_id:user._id})
return {token}
}



async login(loginDto:loginDto):Promise<{token:string}>{
const {email,password}=loginDto
const isUser=await this.Usermodel.findOne({email:email})
if(!isUser){
throw new UnauthorizedException('Invalid email ')
}
const isRightPassword= await bcrypt.compare(password,isUser.password)

if(!isRightPassword){
throw new UnauthorizedException('Wrong Password')
}
const token= this.JwtService.sign({_id:isUser._id})
return {token}
}
}
