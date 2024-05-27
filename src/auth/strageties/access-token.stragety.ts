import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {
    super({
      jwtFromRequest: (req: Request) =>
        req.headers.authorization?.split(' ')[1] || req.cookies.accessToken,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<any> {
    console.log(payload, "from access stragety")
    const user = await this.userModel.findById(payload.sub);
    if (user) return user;
    throw new UnauthorizedException('Unauthorized condition');
  }
}
