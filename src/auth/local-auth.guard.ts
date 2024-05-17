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
    @InjectModel(User.name) 
  private authService: AuthService) {
    super({
      username:'email',
      password:'password'
    });
  }

  async validateUser(email: string, password: string): Promise<any> {
    console.log({email,password})
    const user = await this.authService.validateUser({email, password});
    if (!user) {
      console.log("Not available")
      throw new UnauthorizedException({messege:"this is error "});
    }
    return user;
  }
}


 

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
