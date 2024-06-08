import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
 import * as cookieParser from 'cookie-parser'
import { json, urlencoded } from 'express';
import { useContainer } from 'class-validator';
 
import helmet from 'helmet';
 
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Blog api')
  .setDescription('Blog routes are described here')
  .setVersion('1.0')
  .addTag('blog')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(cookieParser());
  
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS, 
    methods: ['GET', 'POST','PUT','DELETE'],    
    
    credentials: true,
     
  }));
 
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(4000);
  console.log('App loaded at port 4000')
}
bootstrap();
