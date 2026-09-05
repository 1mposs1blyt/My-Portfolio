import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { execSync } from 'child_process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Запуск генерации / миграций и сидинга при старте
  // try {
  //   console.log('Running database seed...');
  //   execSync('npx prisma db seed', { stdio: 'inherit' });
  // } catch (e) {
  //   console.error('Seeding skipped or failed:', e);
  // }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'http://192.168.1.62:5173'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
