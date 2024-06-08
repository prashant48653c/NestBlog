import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local-auth.guard';  
import { User, USERSCHEMA } from './schema/user.schema';  
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenStrategy } from './strageties/access-token.stragety';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),  
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXP'),
        },
      }),
    }),
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: USERSCHEMA }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy,AccessTokenStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
