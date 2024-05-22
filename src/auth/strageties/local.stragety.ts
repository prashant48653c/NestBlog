import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
 
import { InjectModel } from '@nestjs/mongoose';
 
import { AuthGuard } from '@nestjs/passport';
import { User } from '../schema/user.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
   
  constructor( 
  private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    })
  }

  async validate(email: string, password: string){
    
    const user= await this.authService.validateUser({ email, password });
    return user

  }
}
