import { NotFoundException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export class AUTH_UTILITY {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = process.env.PASSWORD_SALT;  
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword)
    return hashedPassword;
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

}
