import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './schema/blog.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name)
        private blogModel:mongoose.Model<Blog>
    ){}


    async findAllBlogs():Promise<Blog[]>{
        const blogs=await this.blogModel.find()
        return blogs
    }

    async createNewBlog(blog:Blog):Promise<Blog>{
        const res=await this.blogModel.create(blog)
        return res
    }

    async findSingleBlog(id:string):Promise<Blog>{
        const singleBlog=await this.blogModel.findById(id)
        if(!singleBlog){
            throw new NotFoundException('Blog not found')
        }
        return singleBlog
    }


    async updateBlog(id:string,newBlog:Blog):Promise<Blog>{
        return await this.blogModel.findByIdAndUpdate(id,newBlog,{
            new:true,
            runValidators:true
          })


        
        
    }

    
    async deleteBlog(id:string):Promise<Blog>{
        return await this.blogModel.findByIdAndDelete(id)

          
        
        
    }



}
