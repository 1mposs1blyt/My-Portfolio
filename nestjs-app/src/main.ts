import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { execSync } from 'child_process';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://1mposs1blyt.duckdns.org']
        : ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
