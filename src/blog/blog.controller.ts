import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './schema/blog.schema';
import { createBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Query as ExpressQuery } from 'express-serve-static-core'
 
import { AccessTokenGuard } from '../guards/access-token.guard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';




@Controller('blogs')
@ApiTags("Blogs")
@ApiSecurity("Jwt-Auth")
export class BlogController {
    constructor(private blogService: BlogService) { }

    @Get()
  
    @UseGuards(AccessTokenGuard)

    async getAllBlogs(@Query() query?: ExpressQuery): Promise<{ blogs: Blog[], total: number }> {
       
        const { blogs, total } = await this.blogService.findAllBlogs(query)
        return {
          blogs,
          total

    }
    }
   
    @Post('create')
     @UseGuards(AccessTokenGuard)
    async createBlog(@Body() blog: createBlogDto, @Req() req): Promise<Blog> {
        console.log(req.user,"Request")
        return this.blogService.createNewBlog(blog,req.user)

    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)

    async findSingleBlog(@Param('id') id: string): Promise<Blog> {
        return this.blogService.findSingleBlog(id)
    }



    @Put(':id')
    @UseGuards(AccessTokenGuard)

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
    @UseGuards(AccessTokenGuard)

    async deleteTheBlog
        (

            @Param('id')
            id: string

        ): Promise<Blog> {
        return this.blogService.deleteBlog(id)
    }

 

}
