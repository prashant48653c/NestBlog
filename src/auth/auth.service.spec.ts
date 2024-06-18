import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    refreshToken: 'slfjsdfe3d',
    profilePic:'i.png'
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    findOneAndUpdate: jest.fn()
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const authUtilityMock = {
    hashPassword: jest.fn(),
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
        {
          provide: 'AUTH_UTILITY',
          useValue: authUtilityMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should throw an error if user already exists', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(true);
      const signUpDto = { username: 'test', email: 'test@example.com', password: 'password' };

      await expect(service.signUp(signUpDto))
        .rejects
        .toThrow(new HttpException('Credential error', HttpStatus.BAD_REQUEST, { cause: 'Email already exist' }));
    });

    it('should create a user and send access and refresh token', async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);
      const signUpDto = { username: 'test', email: 'test@example.com', password: 'password' };

      authUtilityMock.hashPassword.mockResolvedValueOnce('hashedPassword');
      mockUserModel.create.mockResolvedValueOnce({ _id: 'userId', ...signUpDto, password: 'hashedPassword' });
      jwtServiceMock.sign.mockReturnValueOnce('token').mockReturnValueOnce('refreshToken');
      mockUserModel.findOneAndUpdate.mockResolvedValueOnce({ _id: 'userId', refreshToken: 'refreshToken' });

      const result = await service.signUp(signUpDto);

     
      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ token: 'token', refreshToken: 'refreshToken' });
    });
  });

  describe('login', () => {
    it('should login the user', async () => {
      const user = { email: 'test@example.com', password: 'password',  };

      jwtServiceMock.sign.mockReturnValueOnce('token').mockReturnValueOnce('refreshToken');
      mockUserModel.findOneAndUpdate.mockResolvedValueOnce({ ...user, refreshToken: 'refreshToken' });

      const result = await service.login(mockUser);

      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ _id: mockUser._id }, { expiresIn: '2d' });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ _id: mockUser._id }, { expiresIn: '7d' });
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUser._id },
        { $set: { refreshToken: 'refreshToken' } },
        { new: true }
      );
      expect(result).toEqual({ user:mockUser, token: 'token', refreshToken: 'refreshToken' });
    });
    it('should throw NotFoundException if user not found', async () => {
      const invalidUser = { email: 'invalid@example.com', password: 'password' };
    
      mockUserModel.findOne.mockResolvedValueOnce(null);
    
      await expect(service.login(invalidUser as User))
        .rejects
        .toThrow(new NotFoundException({messege:'User not found'}));
    });
    
   
  }); 

  describe('logOut', () => {
    it('should log out the user', async () => {
      const refreshToken = 'slfjsdfe3d';
  
      mockUserModel.findOne.mockResolvedValueOnce(mockUser);
  
      const result = await service.logOut(refreshToken);
  
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ refreshToken });
      expect(mockUserModel.updateOne).toHaveBeenCalledWith(
        { _id: mockUser._id },
        { $unset: { refreshToken: '' } }
      );
      expect(result).toEqual({ message: 'Successfully logged out' });
    });
  
    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';
  
      mockUserModel.findOne.mockRejectedValue(null);
  const result=await model.findOne({refreshToken})
      await expect(service.logOut(refreshToken))
        .rejects
        .toThrow(new UnauthorizedException('Invalid refresh token'));
    });
  });
  

  


});
