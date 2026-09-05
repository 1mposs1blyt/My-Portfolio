import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service.js';
import { ReviewType, ReviewTokenValidType } from './dto/reviews.type.js';
import { CreateReviewInput } from './dto/create-review.input.js';

@Resolver()
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Получить все отзывы для портфолио
  @Query(() => [ReviewType], { name: 'reviews' })
  async getReviews() {
    return this.reviewsService.findAll();
  }

  // Проверка токена при открытии страницы формы
  @Query(() => ReviewTokenValidType, { name: 'validateReviewToken' })
  async validateReviewToken(@Args('token') token: string) {
    return this.reviewsService.validateToken(token);
  }

  // Отправка отзыва по токену
  @Mutation(() => ReviewType, { name: 'submitReview' })
  async submitReview(@Args('input') input: CreateReviewInput) {
    return this.reviewsService.createWithToken(input);
  }
}
