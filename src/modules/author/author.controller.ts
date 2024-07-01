import { Controller, Get, Param, Put, Body, UseInterceptors, UploadedFile, Patch, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { User } from '../auth/schema/user.schema';
 
import { updateUserDto } from './dto/update.user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../config/multer.config';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../guards/access-token.guard';

@Controller('author')
@ApiTags("Author")
@ApiSecurity("Jwt-Auth")


export class AuthorController {
    constructor(private authorService: AuthorService) { }

    @UseGuards(AccessTokenGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Should find the user information using id' })
    @ApiResponse({ status: 200, description: 'User founded' })
    
    @ApiResponse({ status: 404, description: 'User Not Found' })
  
    async getUserInfo(@Param('id') id: string): Promise<User> {
        const info = await this.authorService.getUserInfo(id)
        return info
    }

    @UseGuards(AccessTokenGuard)

    @Put()
    @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
 

    async updateUser(@Body() updateUserDto: updateUserDto): Promise<User> {
        const { id, username, desc } = updateUserDto;
        const updatedUser = await this.authorService.updateUserInfo({ id, username, desc });
        return updatedUser

    }


    @UseGuards(AccessTokenGuard)

    @Patch(':_id')
    @ApiOperation({ summary: 'Update user picture' })
    @ApiResponse({ status: 200, description: 'Profile Picture successfully updated' })
    @ApiResponse({ status: 404, description: 'User Not Found' })

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
