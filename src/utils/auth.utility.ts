import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class AUTH_UTILITY {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.PASSWORD_SALT) || 12 ;
    return await bcrypt.hash(password, saltRounds);
  
  }

  static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }


  

  static async APIERROR() {
     throw new NotFoundException("Item not found");
     
   }


   static isTokenExpired(token: string): boolean {
    try {
      
      const decodedToken = jwt.decode(token) as { exp: number };

      if (!decodedToken || !decodedToken.exp) {
        throw new UnauthorizedException('Token does not contain expiration date');
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

 


