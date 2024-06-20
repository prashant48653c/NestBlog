import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UsersModel } from '../auth/schema/user.schema';
 

@Injectable()
export class AuthorService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  async getUserInfo(id: string): Promise<any> {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new NotFoundException({message:"User doesn't exist"})
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
    if(!updatedUser){
      throw new BadRequestException('Invalid user ID')
    }
    return updatedUser

  }

  async updatePP(file: Express.Multer.File, _id: string) {
    

   
    const updatedUser = await this.userModel.findByIdAndUpdate(
      _id,
      { profilePic: `http://localhost:4000/${file.path}` },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser


  }


}
