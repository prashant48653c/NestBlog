import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AUTH_UTILITY } from './utility/auth.utility';

describe('AuthService', () => {
  let service: AuthService;
  let userModelMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'), // Assuming 'User' is the name of the model
          useValue: userModelMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    userModelMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
    };
  });

  describe('signUp', () => {
    it('should create a new user and return tokens', async () => {
      const signUpDto = { username: 'testuser', email: 'test@example.com', password: 'password' };
      userModelMock.findOne.mockResolvedValue(null);
      userModelMock.create.mockResolvedValue({ _id: 'user_id' });
      jwtServiceMock.sign.mockReturnValue('access_token');

      const result = await service.signUp(signUpDto);

      expect(result.token).toEqual('access_token');
      expect(result.refreshToken).toBeDefined();
      expect(userModelMock.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: expect.any(String),
      });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ _id: 'user_id' }, { expiresIn: '10m' });
    });

    it('should throw an error if email already exists', async () => {
      const signUpDto = { username: 'testuser', email: 'existing@example.com', password: 'password' };
      userModelMock.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await expect(service.signUp(signUpDto)).rejects.toThrow(HttpException);
    });
  });

  // Write similar tests for other methods like login, validateUser, and refreshTokens
});
