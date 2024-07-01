import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UsersModel } from '../auth/schema/user.schema';
import { cloudinaryConfig } from '../../config/cloudinary.config';
import * as cloudinary from 'cloudinary'
import * as fs from 'fs';



@Injectable()
export class AuthorService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  async getUserInfo(id: string): Promise<any> {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException({ message: "User doesn't exist" })
    }
    return user
  }

  async updateUserInfo(userData: { username: string, desc: string, id: string }): Promise<any> {
    const { username, desc, id } = userData


    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { username: username, desc: desc },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new BadRequestException('Invalid user ID')
    }
    return updatedUser

  }

  async updatePP(file: Express.Multer.File, _id: string) {
   await cloudinary.v2.config(cloudinaryConfig)
    const upload = await cloudinary.v2.uploader.upload(file.path, {
      use_filename: true,
      resource_type: 'auto',
      chunk_size: cloudinaryConfig.chunk_size,
    })
   
    console.log('Upload Progress:', upload.bytes);


const result=await upload
console.log(result.secure_url)

    const updatedUser = await this.userModel.findByIdAndUpdate(
      _id,
      { profilePic: result.secure_url },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    fs.unlinkSync(file.path);

    return updatedUser


  }


}
