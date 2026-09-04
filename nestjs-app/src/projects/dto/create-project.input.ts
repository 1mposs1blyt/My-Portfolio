import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field({ nullable: true })
  repoUrl?: string;
  @Field({ nullable: true })
  liveUrl?: string;
  @Field(() => [String])
  stack: string[];
  @Field(() => Int)
  order: number;
}
