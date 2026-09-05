import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js'; // Поправь путь к своему PrismaService
import { CreateReviewInput } from './dto/create-review.input.js';
import { ReviewKind } from './dto/reviews.type.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async validateToken(tokenId: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tokenId)) {
      return { isValid: false };
    }

    const token = await this.prisma.reviewToken.findUnique({
      where: { id: tokenId },
      include: { project: true },
    });

    if (!token || token.isUsed || token.expiresAt < new Date()) {
      return { isValid: false };
    }

    return {
      isValid: true,
      type: token.type as ReviewKind,
      projectId: token.projectId,
      projectName: token.project?.name,
    };
  }

  async createWithToken(input: CreateReviewInput) {
    const tokenValidation = await this.validateToken(input.token);
    if (!tokenValidation.isValid) {
      throw new BadRequestException(
        'Ссылка недействительна или уже использована',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Маркируем токен как использованный
      await tx.reviewToken.update({
        where: { id: input.token },
        data: { isUsed: true },
      });

      const reviewData: any = {
        type: tokenValidation.type,
        authorName: input.authorName,
        company: input.company ?? undefined,
        position: input.position ?? undefined,
        text: input.text,
        rating: input.rating ?? undefined,
      };

      if (tokenValidation.projectId) {
        reviewData.project = {
          connect: { id: tokenValidation.projectId },
        };
      }

      return tx.review.create({
        data: reviewData,
      });
    });
  }
}
