import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './schema/blog.schema';

@Controller('blogs')
export class BlogController {
    constructor(private blogService: BlogService) { }

    @Get()
    async getAllBlogs(): Promise<Blog[]> {
        return this.blogService.findAllBlogs()

    }

    @Post('create')
    async createBlog(
        @Body()

        blog: Blog
    ): Promise<Blog> {
        return this.blogService.createNewBlog(blog)

    }

    @Get(':id')
    async findSingleBlog
        (

            @Param('id')
            id: string

        ): Promise<Blog> {
        return this.blogService.findSingleBlog(id)
    }



    @Put(':id')
    async update
        (
            @Param('id')
            id: string,
            @Body()
            newBlog: Blog
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
