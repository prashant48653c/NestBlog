import { Controller, Get, Param,Put,Body } from '@nestjs/common';
import { AuthorService } from './author.service';
import { User } from 'src/auth/schema/user.schema';
import { UpdateBlogDto } from 'src/blog/dto/update-blog.dto';
import { updateUserDto } from './dto/update.user.dto';

@Controller('author')
export class AuthorController {
    constructor(private authorService: AuthorService) { }

    @Get(':id')
    async getUserInfo(@Param('id') id:string):Promise<User>{
const info= await this.authorService.getUserInfo(id)
return info
    }

    @Put()
    async updateUser(@Body() updateUserDto:updateUserDto) {
        const { id, username, desc } = updateUserDto;
        const updatedUser = await this.authorService.updateUserInfo({ id, username, desc });
    return updatedUser

    }
}
