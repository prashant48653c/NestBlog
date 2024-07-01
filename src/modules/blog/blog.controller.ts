import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './schema/blog.schema';
import { createBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Query as ExpressQuery } from 'express-serve-static-core'

import { AccessTokenGuard } from '../../guards/access-token.guard';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';




@Controller('blogs')
@ApiTags("Blogs")
@ApiSecurity("Jwt-Auth")
export class BlogController {
    constructor(private blogService: BlogService) { }



    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Get all blog ' })
    @ApiResponse({ status: 200, description: 'Got all blogs based on query' })


    async getAllBlogs(@Query() query?: ExpressQuery): Promise<{ blogs: Blog[], total: number }> {

        const { blogs, total } = await this.blogService.findAllBlogs(query)
        return {
            blogs,
            total

        }
    }

    @Post('create')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create new blog' })
    @ApiResponse({ status: 201, description: 'Created new blog' })
    @ApiResponse({ status: 500, description: 'Server error' })

    async createBlog(@Body() blog: createBlogDto, @Req() req): Promise<Blog> {
        console.log(req.user, "Request")
        return this.blogService.createNewBlog(blog, req.user)

    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)

    @ApiOperation({ summary: 'Get specific blog with id' })
    @ApiResponse({ status: 200, description: 'Got all blogs based on query' })
    @ApiResponse({ status: 400, description: 'Invalid id' })
    @ApiResponse({ status: 404, description: 'Blog not found' })

    async findSingleBlog(@Param('id') id: string): Promise<Blog> {
        return this.blogService.findSingleBlog(id)
    }



    @Put(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update the blog' })
    @ApiResponse({ status: 200, description: 'Updated the blog' })

    @ApiResponse({ status: 404, description: 'Blog not found' })

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
    @ApiOperation({ summary: 'Delete the blog' })
    @ApiResponse({ status: 200, description: 'Deleted the blog' })

    @ApiResponse({ status: 404, description: 'Blog not found' })

    async deleteTheBlog
        (

            @Param('id')
            id: string

        ): Promise<Blog> {
        return this.blogService.deleteBlog(id)
    }



}
