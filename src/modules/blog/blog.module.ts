import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BLOGSCHEMA } from './schema/blog.schema';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports:[ AuthModule,MongooseModule.forFeature([{name:'Blog',schema:BLOGSCHEMA}])],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
