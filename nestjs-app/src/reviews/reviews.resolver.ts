import { ID, Mutation, Args, Query, Resolver } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard.js';
import { ReviewsService } from './reviews.service.js';
import { ReviewType, ReviewTokenValidType } from './dto/reviews.type.js';
import { ReviewTokenType } from './dto/review-token.type.js';
import { CreateReviewInput } from './dto/create-review.input.js';
import { CreateReviewTokenInput } from './dto/create-review-token.input.js';
import { Language } from '../generated/prisma/client.js';

@Resolver()
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Query(() => [ReviewType], { name: 'reviews' })
  async getReviews(
    @Args('lang', { type: () => Language, defaultValue: Language.RU })
    lang: Language,
  ) {
    return this.reviewsService.findAllWithLang(lang);
  }

  @Query(() => ReviewTokenValidType, { name: 'validateReviewToken' })
  async validateReviewToken(@Args('token') token: string) {
    return this.reviewsService.validateToken(token);
  }

  @Mutation(() => ReviewType, {
    name: 'submitReview',
  })
  async submitReview(@Args('input') input: CreateReviewInput) {
    return this.reviewsService.createWithToken(input);
  }

  @Query(() => [ReviewTokenType], {
    name: 'reviewTokens',
  })
  @UseGuards(AdminGuard)
  async getReviewTokens() {
    return this.reviewsService.findTokens();
  }

  @Mutation(() => ReviewTokenType, {
    name: 'createReviewToken',
  })
  @UseGuards(AdminGuard)
  async createReviewToken(@Args('input') input: CreateReviewTokenInput) {
    return this.reviewsService.createToken(input);
  }

  @Mutation(() => Boolean, {
    name: 'revokeReviewToken',
  })
  @UseGuards(AdminGuard)
  async revokeReviewToken(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    await this.reviewsService.revokeToken(id);
    return true;
  }

  @Mutation(() => Boolean, {
    name: 'deleteReview',
  })
  @UseGuards(AdminGuard)
  async deleteReview(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    await this.reviewsService.removeReview(id);
    return true;
  }
}
