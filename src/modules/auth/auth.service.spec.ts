import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, HttpException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'
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
    profilePic: 'i.png'
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findByIdAndUpdate: jest.fn()
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const authUtilityMock = {
    hashPassword: jest.fn(),
    comparePasswords: jest.fn()
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



      jwtServiceMock.sign.mockReturnValueOnce('token').mockReturnValueOnce('slfjsdfe3d');
      mockUserModel.findOneAndUpdate.mockResolvedValueOnce({ ...mockUser, refreshToken: 'slfjsdfe3d' });

      const result = await service.login(mockUser);

      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ _id: mockUser._id }, { expiresIn: '2d' });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ _id: mockUser._id }, { expiresIn: '7d' });
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUser._id },
        { $set: { refreshToken: 'slfjsdfe3d' } },
        { new: true }
      );
      expect(result).toEqual({ user: mockUser, token: "token", refreshToken: mockUser.refreshToken });
    });



    it('should throw NotFoundException if user not found', async () => {
      const invalidUser = { email: 'invalid@example.com', password: 'password' };

      mockUserModel.findOne.mockResolvedValueOnce(null);

      await expect(service.login(invalidUser as User))
        .rejects
        .toThrow(new NotFoundException({ messege: 'User not found' }));
    });


  });

  describe('logOut', () => {
    it('should log out the user', async () => {
      const refreshToken = mockUser.refreshToken;
      mockUserModel.findOne = jest.fn().mockResolvedValue(mockUser);
      mockUserModel.updateOne = jest.fn().mockResolvedValue({});
      await service.logOut(refreshToken);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ refreshToken: mockUser.refreshToken });
      expect(mockUserModel.updateOne).toHaveBeenCalledWith({ _id: mockUser._id }, { $unset: { refreshToken: "" } });


    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockUserModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.logOut('invalid-refresh-token'))
        .rejects
        .toThrow(new UnauthorizedException('Invalid refresh token'));

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ refreshToken: 'invalid-refresh-token' });
    });


  });

  describe('validate', () => {
    it('should throw BadRequestException if password is incorrect', async () => {

      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(authUtilityMock, 'comparePasswords').mockResolvedValue(false);

      const loginData = { email: 'test@example.com', password: 'wrongpassword' };
      await expect(service.validateUser(loginData)).rejects.toThrow(new BadRequestException({message:'Invalid password'}));

    });

    it('should return user if email and password are correct', async () => {
      const loginData = { email: 'test@example.com',   password: await bcrypt.hash('password', 10)  };

  jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(
   mockUser
  );
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); 
  jest.spyOn(authUtilityMock, 'comparePasswords').mockResolvedValue(true); 

  const result = await service.validateUser(loginData);

  expect(result).toBeDefined();
  expect(result).toBe(mockUser);
     
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

      const loginData = { email: 'nonexistent@example.com', password: 'password' };
      await expect(service.validateUser(loginData)).rejects.toThrow(NotFoundException);
    });


  })


  describe('refreshTokens', () => {
    it('should return new tokens if refresh token is valid', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(jwtServiceMock, 'sign').mockImplementation((payload, options) => `token-${payload.id}-${options.expiresIn}`);
      jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue(mockUser);

      const tokensType = { REFRESHTOKEN: 'oldRefreshToken' };
      const result = await service.refreshTokens(tokensType);

      expect(result).toEqual({
        accessToken: 'token-12345-2d',
        refreshToken: 'token-12345-7d',
      });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ refreshToken: tokensType.REFRESHTOKEN });
      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(2);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, { refreshToken: 'token-12345-7d' });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

      const tokensType = { REFRESHTOKEN: 'invalidRefreshToken' };
      await expect(service.refreshTokens(tokensType)).rejects.toThrow(UnauthorizedException);
    });
  })


});
