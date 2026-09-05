import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ReviewKind } from './reviews.type.js';
@ObjectType()
export class ReviewTokenType {
  @Field(() => ID)
  id: string;
  @Field(() => ReviewKind)
  type: ReviewKind;
  @Field({
    nullable: true
  })
  projectId?: string;
  @Field({
    nullable: true
  })
  projectName?: string;
  @Field()
  isUsed: boolean;
  @Field()
  expiresAt: Date;
  @Field()
  createdAt: Date;
}