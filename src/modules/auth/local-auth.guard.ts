import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
   
  constructor( 
  private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    });
  }

  async validate(email: string, password: string){
    
    const user= await this.authService.validateUser({ email, password });
    return user

  }
}


 

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
