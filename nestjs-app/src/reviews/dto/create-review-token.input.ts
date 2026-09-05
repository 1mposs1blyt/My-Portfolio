import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { ReviewKind } from './reviews.type.js';

@InputType()
export class CreateReviewTokenInput {
  @Field(() => ReviewKind)
  @IsEnum(ReviewKind)
  type: ReviewKind;

  @Field(() => ID, { nullable: true })
  @IsOptional() @IsUUID()
  projectId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional() @IsInt() @Min(1) @Max(365)
  days?: number;
}