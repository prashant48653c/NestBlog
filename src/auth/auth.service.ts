import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UsersModel } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { AUTH_UTILITY } from './utility/auth.utility';
import { loginType, returnedTokenType, signUpType, tokensType, validateType } from './types/helper';


@Injectable()



export class AuthService {
  constructor(
    @InjectModel(User.name)
    private Usermodel: Model<User>,
    private JwtService: JwtService
  ) { }



  async signUp(signUpDto: signUpDto): Promise<signUpType> {

    const { username, email, password } = signUpDto
    const isOldUser = await this.Usermodel.findOne({ email })
    if (isOldUser) {
      throw new HttpException('Credential error', HttpStatus.BAD_REQUEST, { cause: 'Email already exist' });

    }

    const HashPassword = await AUTH_UTILITY.hashPassword(password);

    const user = await this.Usermodel.create({ username, email, password: HashPassword })
    const token = await this.JwtService.sign({ _id: user._id }, { expiresIn: '2d' });
    const refreshToken = await this.JwtService.sign({ _id: user._id }, { expiresIn: '7d' })


    const updatedUser = await this.Usermodel.findOneAndUpdate(
      { _id: user._id },
      { $set: { refreshToken } },
      { new: true }
    );
    // console.log(updatedUser);





    return { token, refreshToken }
  }



  async login(user: User): Promise<loginType> {

    const token = await this.JwtService.sign({ _id: user._id }, { expiresIn: '2d' });
    const refreshToken = await this.JwtService.sign({ _id: user._id }, { expiresIn: '7d' })


    const updatedUser = await this.Usermodel.findOneAndUpdate(
      { _id: user._id },
      { $set: { refreshToken } },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundException({ messege: 'User not found' })
    }

    return { user: updatedUser, token, refreshToken };
  }



  async validateUser(loginData: validateType): Promise<any> {
    const { email, password } = loginData
    console.log(email, 'from validateuser')

    const isUser = await this.Usermodel.findOne({ email: email.toLowerCase() })
    if (!isUser) {
      throw new NotFoundException({ message: 'User not found' })


    }
    const isRightPassword = await AUTH_UTILITY.comparePasswords(password, isUser.password)

    if(isRightPassword){
      return isUser
    }
   else {
      throw new BadRequestException({ message: "Invalid password" })
    }
    
    
  }

  async refreshTokens({ REFRESHTOKEN }: tokensType): Promise<returnedTokenType> {
    const User = await this.Usermodel.findOne({ refreshToken: REFRESHTOKEN });
  
    if (!User) {
      throw new UnauthorizedException({ messege: 'Invalid refresh token' });
    }
  
    const newRefreshToken = this.JwtService.sign({ id: User._id }, { expiresIn: '7d' });
    await this.Usermodel.findByIdAndUpdate(User._id, { refreshToken: newRefreshToken });
  
    const newAccessToken = this.JwtService.sign({ id: User._id }, { expiresIn: '2d' });
  
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
  
  



  async logOut(refreshToken: string): Promise<any> {
    const user = await this.Usermodel.findOne({ refreshToken });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.Usermodel.updateOne({ _id: user._id }, { $unset: { refreshToken: "" } });

    return { message: 'Successfully logged out' };
  }


}
