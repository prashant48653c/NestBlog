import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { USERSCHEMA } from 'src/auth/schema/user.schema';

@Module({
  imports:[ AuthModule,MongooseModule.forFeature([{name:'User',schema:USERSCHEMA}])],
  controllers: [AuthorController],
  providers: [AuthorService]
})
export class AuthorModule {}
