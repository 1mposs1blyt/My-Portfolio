import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { execSync } from 'child_process';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'http://192.168.1.62:5173'],
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/'
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();