import { ID, Mutation, Args, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard.js';
import { ReviewTokenType } from './dto/review-token.type.js';
import { CreateReviewTokenInput } from './dto/create-review-token.input.js';
import { ReviewsService } from './reviews.service.js';

@Resolver()
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Получить все отзывы для портфолио
  @Query(() => [ReviewTokenType], { name: 'reviewTokens' })
  @UseGuards(AdminGuard)
  async getReviewTokens() {
    return this.reviewsService.findTokens();
  }

  @Mutation(() => ReviewTokenType, { name: 'createReviewToken' })
  @UseGuards(AdminGuard)
  async createReviewToken(@Args('input') input: CreateReviewTokenInput) {
    return this.reviewsService.createToken(input);
  }

  @Mutation(() => Boolean, { name: 'revokeReviewToken' })
  @UseGuards(AdminGuard)
  async revokeReviewToken(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    await this.reviewsService.revokeToken(id);
    return true;
  }

  @Mutation(() => Boolean, { name: 'deleteReview' })
  @UseGuards(AdminGuard)
  async deleteReview(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    await this.reviewsService.removeReview(id);
    return true;
  }
}
