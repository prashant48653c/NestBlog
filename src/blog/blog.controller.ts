import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './schema/blog.schema';
import { createBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
 

@Controller('blogs')
export class BlogController {
    constructor(private blogService: BlogService) { }

    @Get()
    async getAllBlogs(@Query('title') title?:string ): Promise<Blog[]> {
        return this.blogService.findAllBlogs(title)

    }

    @Post('create')
    async createBlog( @Body()  blog: createBlogDto): Promise<Blog> {
        return this.blogService.createNewBlog(blog)

    }

    @Get(':id')
    async findSingleBlog  (  @Param('id')   id: string  ): Promise<Blog> {
        return this.blogService.findSingleBlog(id)
    }



    @Put(':id')
    async update
        (
            @Param('id')
            id: string,
            @Body()
            newBlog: UpdateBlogDto
        ): Promise<Blog> {
        return this.blogService.updateBlog(id, newBlog)
    }

    @Delete(':id')
    async deleteTheBlog
        (

            @Param('id')
            id: string

        ): Promise<Blog> {
        return this.blogService.deleteBlog(id)
    }

}
