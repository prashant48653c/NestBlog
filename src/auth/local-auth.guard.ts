import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    constructor(
        @InjectModel(User.name)
    private UserModel:Model<User>,
    private authService:AuthService
     )
     {
    super( )   
    
     }   
    
    
    async login(email:string,password:string):Promise<any>{
        
        
        const user=  await this.authService.login({email, password});
        if(!user){
            throw new UnauthorizedException()
        }
        return user
    }
    
    
}