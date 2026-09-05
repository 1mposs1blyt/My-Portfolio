import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field() token: string;
  @Field() authorName: string;
  @Field({ nullable: true }) company?: string;
  @Field({ nullable: true }) position?: string;
  @Field() text: string;
  @Field(() => Int, { nullable: true }) rating?: number;
}
