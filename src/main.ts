import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser'
import { json, urlencoded } from 'express';
import { useContainer } from 'class-validator';
import express from 'express'
import helmet from 'helmet';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Blog api')
    .setDescription('Blog routes are described here')
    .setVersion('1.0')
    .addBearerAuth({
      type:'http',
      scheme:'bearer',
      bearerFormat:'JWT',
      name:'JWT',
      description:"Enter bearer token",
      in:"header"

    },'Jwt-Auth')
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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

    credentials: true,

  }));
 

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(4000);
  console.log('App loaded at port 4000')
}
bootstrap();
