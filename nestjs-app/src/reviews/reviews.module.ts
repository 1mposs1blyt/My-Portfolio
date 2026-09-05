import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { ReviewsResolver } from './reviews.resolver.js';
import { PrismaService } from '../common/prisma/prisma.service.js'; // Поправь путь к своему PrismaService

@Module({
  providers: [ReviewsService, ReviewsResolver, PrismaService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
