import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AUTH_UTILITY } from './utility/auth.utility';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;
  
  
  let mockUser: User = {
    _id: '12345',
    username: 'testuser',
    email: 'test@example.com',
    desc: 'Test user description',
    password: 'password',
  };
  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  };
  const jwtServiceMock = {
    sign: jest.fn(),
  };
  const bcryptMock = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name), 
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
       
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

 
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user and return tokens', async () => {
      const signUpDto = { username: 'testuser', email: 'test@example.com', password: 'password' };
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({ _id: 'user_id' });
      jwtServiceMock.sign.mockReturnValue('access_token');

      const result = await service.signUp(signUpDto);

      expect(result.token).toEqual('access_token');
      expect(result.refreshToken).toBeDefined();
      expect(mockUserModel.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: expect.any(String),
      });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ _id: 'user_id' }, { expiresIn: '1h' });
    });

    it('should throw an error if email already exists', async () => {
      const signUpDto = { username: 'testuser', email: 'existing@example.com', password: 'password' };
      mockUserModel.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await expect(service.signUp(signUpDto)).rejects.toThrow(HttpException);
    });
  });


  describe('login',()=>{
    it('should login the user',()=>{
      const loginDto = { email: 'test@example.com', password: 'password' };
      expect(loginDto)
    })
  })

   
});
