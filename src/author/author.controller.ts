import { Controller, Get, Param, Put, Body, UseInterceptors, UploadedFile, Patch, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { AuthorService } from './author.service';
import { User } from '../auth/schema/user.schema';
 
import { updateUserDto } from './dto/update.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../multer/multer.config';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('author')
@ApiTags("Author")
@ApiSecurity("Jwt-Auth")


export class AuthorController {
    constructor(private authorService: AuthorService) { }

    @Get(':id')
    async getUserInfo(@Param('id') id: string): Promise<User> {
        const info = await this.authorService.getUserInfo(id)
        return info
    }

    @Put()
    async updateUser(@Body() updateUserDto: updateUserDto): Promise<User> {
        const { id, username, desc } = updateUserDto;
        const updatedUser = await this.authorService.updateUserInfo({ id, username, desc });
        return updatedUser

    }



    @Patch(':_id')
    @UseInterceptors(FileInterceptor('file', multerOptions))
    async updatePP(
      @UploadedFile()
      file: Express.Multer.File,
      @Param('_id') _id: string,
    ) {

      
        const updatedUser:User = await this.authorService.updatePP(file, _id)
        return updatedUser
    }





}
