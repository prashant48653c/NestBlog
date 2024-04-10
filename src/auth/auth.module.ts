import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport'
import { MongooseModule } from '@nestjs/mongoose';
import { USERSCHEMA } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import {  ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { LocalAuthGuard } from './local-auth.guard';
 

@Module({
  imports: [

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({    //getting env keys for jwt
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: {
           expiresIn: config.get<string | number>('JWT_EXP')
          }

  }
      }
    }),
    MongooseModule.forFeature([{ name: 'User', schema: USERSCHEMA }])
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalAuthGuard],
  exports:[JwtStrategy,PassportModule]  //exporting to use in blog
})
export class AuthModule { }
