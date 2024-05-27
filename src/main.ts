import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
 
import { json, urlencoded } from 'express';
import { useContainer } from 'class-validator';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
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
