import { BadRequestException, Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schema/blog.schema';
import * as mongoose from 'mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { User } from 'src/auth/schema/user.schema';


@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name)
        private blogModel: mongoose.Model<Blog>
    ) { }


    async findAllBlogs(query: ExpressQuery): Promise<Blog[]> {

        const responsePerPage = 3;
        const currentPage: number = Number(query.page) || 1;
        const skip: number = responsePerPage * (currentPage - 1)
        const keywords:any =  {}

        if(query.keyword){
            
              keywords.head= {
                    $regex: query.keyword as string,
                    $options: 'i'
                }
                //mongoose pagination v2
            
        }
        if (query.tags) {
            keywords.tags = { $in: query.tags as string[] };
        }

        const blog = await this.blogModel.find({ ...keywords }).limit(responsePerPage).skip(skip)
        return blog


    }

    async createNewBlog(blog: Blog, user: User): Promise<Blog> {
        const TrackedBlog = Object.assign(blog, { user: user._id })
        const res = await this.blogModel.create(TrackedBlog)
        return res
    }

    async findSingleBlog(id: string): Promise<Blog> {
        const IsValid = mongoose.isValidObjectId(id)
        if (!IsValid) {
            throw new BadRequestException('Please enter correct idd')
        }
        const singleBlog = await this.blogModel.findById(id)
        if (!singleBlog) {
            throw new NotFoundException('Blog not found')
        }
        return singleBlog
    }


    async updateBlog(id: string, newBlog: Blog): Promise<Blog> {
        return await this.blogModel.findByIdAndUpdate(id, newBlog, {
            new: true,
            runValidators: true
        })




    }


    async deleteBlog(id: string): Promise<Blog> {
        return await this.blogModel.findByIdAndDelete(id)




    }



}
