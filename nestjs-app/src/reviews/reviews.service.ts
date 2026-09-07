import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateReviewInput } from './dto/create-review.input.js';
import { ReviewKind } from './dto/reviews.type.js';
import { CreateReviewTokenInput } from './dto/create-review-token.input.js';
import { Language } from '../generated/prisma/client.js';
@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllWithLang(lang: Language) {
    const reviews = await this.prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reviewTranslations: true,
      },
    });
    return reviews.map((review) => {
      const t =
        review.reviewTranslations.find((x) => x.language === lang) ??
        review.reviewTranslations[0];
      return {
        id: review.id,
        type: review.type,
        authorName: review.authorName,
        company: review.company,
        avatarUrl: review.avatarUrl,
        rating: review.rating,
        projectId: review.projectId,
        createdAt: review.createdAt,
        text: t?.text || '',
        position: t?.position || '',
      };
    });
  }
  async validateToken(tokenId: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tokenId)) {
      return {
        isValid: false,
      };
    }
    const token = await this.prisma.reviewToken.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        project: {
          include: {
            projectTranslations: true,
          },
        },
      },
    });
    if (!token) {
      return {
        isValid: false,
      };
    }
    if (token.isUsed) {
      return {
        isValid: false,
      };
    }
    if (token.expiresAt < new Date()) {
      return {
        isValid: false,
      };
    }
    const projectTranslation = (token.project as any)?.projectTranslations?.[0];
    return {
      isValid: true,
      type: token.type as ReviewKind,
      projectId: token.projectId,
      projectName: projectTranslation?.name || 'Project',
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
      await tx.reviewToken.update({
        where: {
          id: input.token,
        },
        data: {
          isUsed: true,
        },
      });
      const reviewData: any = {
        type: tokenValidation.type,
        authorName: input.authorName,
        company: input.company ?? undefined,
        rating: input.rating ?? undefined,
      };
      if (tokenValidation.projectId) {
        reviewData.project = {
          connect: {
            id: tokenValidation.projectId,
          },
        };
      }
      const review = await tx.review.create({
        data: {
          ...reviewData,
          reviewTranslations: {
            create: {
              language: input.language ?? Language.RU,
              text: input.text,
              position: input.position,
            },
          },
        },
        include: {
          reviewTranslations: true,
        },
      });
      const t = review.reviewTranslations[0];
      return {
        id: review.id,
        type: review.type as ReviewKind,
        authorName: review.authorName,
        company: review.company,
        rating: review.rating,
        projectId: review.projectId,
        createdAt: review.createdAt,
        text: t?.text ?? '',
        position: t?.position ?? '',
      };
    });
  }
  private mapToken(t: any) {
    const projectTranslation = t.project?.projectTranslations?.[0];
    return {
      id: t.id,
      type: t.type as ReviewKind,
      projectId: t.projectId ?? undefined,
      projectName: projectTranslation?.name || t.project?.name,
      isUsed: t.isUsed,
      expiresAt: t.expiresAt,
      createdAt: t.createdAt,
    };
  }
  async createToken(input: CreateReviewTokenInput) {
    if (input.type === ReviewKind.CLIENT && !input.projectId) {
      throw new BadRequestException(
        'Для отзыва заказчика нужно выбрать проект',
      );
    }
    const days = input.days ?? 30;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const token = await this.prisma.reviewToken.create({
      data: {
        type: input.type,
        projectId: input.type === ReviewKind.CLIENT ? input.projectId : null,
        expiresAt,
      },
      include: {
        project: {
          include: {
            projectTranslations: true,
          },
        },
      },
    });
    return this.mapToken(token);
  }
  async findTokens() {
    const list = await this.prisma.reviewToken.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        project: {
          include: {
            projectTranslations: true,
          },
        },
      },
    });
    return list.map((t) => this.mapToken(t));
  }
  async revokeToken(id: string) {
    await this.prisma.reviewToken.delete({
      where: {
        id,
      },
    });
  }
  async removeReview(id: string) {
    await this.prisma.review.delete({
      where: {
        id,
      },
    });
  }
}
