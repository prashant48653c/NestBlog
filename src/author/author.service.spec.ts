import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { User } from '../auth/schema/user.schema';
import mongoose, { model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthorService } from '../author/author.service';

describe('AuthorService', () => {
  let service: AuthorService;
  let userModel: any;

  const mockUser = {
    _id: '12345',
    username: 'testuser',
    email: 'test@example.com',
    desc: 'Test user description',
    password: 'password',
    refreshToken: 'slfjsdfe3d',
  };

  const mockUserModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserInfo', () => {
    it('should return user information if user exists', async () => {
      jest.spyOn(userModel, "findById").mockResolvedValue(mockUser)
      const result = await service.getUserInfo(mockUser._id);
      expect(result).toEqual(mockUser);
      expect(userModel.findById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should throw an error if user does not exist', async () => {
      const id = "invalid id"
      jest.spyOn(userModel, "findById").mockResolvedValue(null)
      const result = await service.getUserInfo(id)
      await expect(service.getUserInfo(id)).rejects.toThrow(NotFoundException);
      await expect(service.getUserInfo(id)).rejects.toThrow("User doesn't exist");


    });
  });

  describe('updateUserInfo', () => {
    it('should update user information', async () => {

      const userData = { username: 'updatedUser', desc: 'Updated description', id: '12345' };

      const updatedUser = { ...mockUser, username: 'updatedUser', desc: 'Updated description' };

      jest.spyOn(userModel, "findByIdAndUpdate").mockReturnValue(updatedUser)

      const result = await service.updateUserInfo(userData);
      expect(result).toEqual(updatedUser);
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userData.id,
        { username: 'updatedUser', desc: 'Updated description' },
        { new: true, runValidators: true }
      );
    });

    it('should throw an error if user ID is invalid', async () => {
      const userData = { username: 'updatedUser', desc: 'Updated description', id: 'invalid_id' };

      await expect(service.updateUserInfo(userData)).toThrow(BadRequestException);
      await expect(service.updateUserInfo(userData)).toThrow('Invalid user ID');

    });
  });
});
