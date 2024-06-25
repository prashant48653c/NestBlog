import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { User } from '../auth/schema/user.schema';
import mongoose, { model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthorService } from '../author/author.service';
import { cloudinaryConfig } from '../cloudinary/config';
import * as cloudinary from 'cloudinary'
import * as fs from 'fs';


describe('AuthorService', () => {
  let service: AuthorService;
  let userModel: any;
  jest.mock('cloudinary');
  jest.mock('fs');

  const mockUser: User = {
    _id: '12345',
    username: 'testuser',
    email: 'test@example.com',
    desc: 'Test user description',
    password: 'password',
    refreshToken: 'slfjsdfe3d',
    profilePic: 'i.png'
  };
  const file: Express.Multer.File = {
    fieldname: 'fileUpload',
    originalname: 'example.txt',
    destination: 'uploads/',
    filename: 'example-12345.txt',
    mimetype: 'text/plain',
    path: 'uploads/example-12345.txt',
    size: 2323,
    stream: null,
    buffer: Buffer.from('Example file content'),
    encoding: '7bit'
  };

  const mockUserModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    updatePP: jest.fn()
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

      await expect(service.getUserInfo(id)).rejects.toThrow(new NotFoundException({ message: "User doesn't exist" }));


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

      jest.spyOn(userModel, "findByIdAndUpdate").mockResolvedValue(null);

      await expect(service.updateUserInfo(userData)).rejects.toThrow(BadRequestException);
      await expect(service.updateUserInfo(userData)).rejects.toThrow('Invalid user ID');
    });

  });

  describe('updatePP', () => {
    it('should return updatedUser with updated profile picture', async () => {
      const file: Express.Multer.File = {
        fieldname: 'fileUpload',
        originalname: 'example.txt',
        destination: 'uploads/',
        filename: 'example-12345.txt',
        mimetype: 'text/plain',
        path: 'uploads/example-12345.txt',
        size: 2323,
        stream: null,
        buffer: Buffer.from('Example file content'),
        encoding: '7bit'
      };
      const _id: string = '123';
      const mockUpdatedUser = {
        _id: '123',
        username: 'updatedUser',
        desc: 'updatedDescription',
        profilePic: 'http://cloudinary.com/secure_url',
        email: 'ac@gmail.com',
        password: 'aaaaaa',
        refreshToken: 'sdfsdfd'
      };
      const uploadResponse:any = { secure_url: 'http://cloudinary.com/secure_url', bytes: 12345 };

      jest.spyOn(cloudinary.v2.uploader, 'upload').mockResolvedValue(uploadResponse);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedUser);
      jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

      const result = await service.updatePP(file, _id);
      expect(result).toEqual(mockUpdatedUser);
      expect(cloudinary.v2.uploader.upload).toHaveBeenCalledWith(file.path, expect.any(Object));
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        _id,
        { profilePic: uploadResponse.secure_url },
        { new: true, runValidators: true }
      );
      expect(fs.unlinkSync).toHaveBeenCalledWith(file.path);
    });

    it('should return NotFoundException if user is not found', async () => {
      const file: Express.Multer.File = {
        fieldname: 'fileUpload',
        originalname: 'example.txt',
        destination: 'uploads/',
        filename: 'example-12345.txt',
        mimetype: 'text/plain',
        path: 'uploads/example-12345.txt',
        size: 2323,
        stream: null,
        buffer: Buffer.from('Example file content'),
        encoding: '7bit'
      };
      const uploadResponse:any = { secure_url: 'http://cloudinary.com/secure_url', bytes: 12345 };

      jest.spyOn(cloudinary.v2.uploader, 'upload').mockResolvedValue(uploadResponse);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(null);
      jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

      await expect(service.updatePP(file, 'nonexistentId')).rejects.toThrow(NotFoundException);

      expect(cloudinary.v2.uploader.upload).toHaveBeenCalledWith(file.path,{
        use_filename: true,
        resource_type: 'auto',
        chunk_size: cloudinaryConfig.chunk_size,
      });

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'nonexistentId',
        { profilePic: uploadResponse.secure_url },
        { new: true, runValidators: true }
      );
      
    });
  });

});
