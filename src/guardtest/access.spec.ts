import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { AccessTokenStrategy } from '../auth/strageties/access-token.stragety';
import { User } from '../auth/schema/user.schema';
import { JwtModule } from '@nestjs/jwt';

describe('AccessTokenStrategy', () => {
  let strategy: AccessTokenStrategy;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY || 'testSecretKey',
        }),
      ],
      providers: [
        AccessTokenStrategy,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<AccessTokenStrategy>(AccessTokenStrategy);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('validate', () => {
    it('should return the user if found', async () => {
      const payload = { _id: 'userId' };
      const req = {
        headers: { authorization: 'Bearer someToken' },
        cookies: {},
      } as Request;
      const user = { _id: 'userId', email: 'test@example.com' };

      jest.spyOn(userModel, 'findById').mockResolvedValue(user);

      const result = await strategy.validate(req, payload);

      expect(result).toEqual(user);
    });


    it('should throw an UnauthorizedException if user is not found', async () => {
      const payload = { _id: 'userId' };
      const req = {
        headers: { authorization: 'Bearer someToken' },
        cookies: {},
      } as Request;

      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      await expect(strategy.validate(req, payload)).rejects.toThrow(new UnauthorizedException({message:'Login to continue'}));
    });
  });
});
