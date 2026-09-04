import { InputType, Field, Int } from '@nestjs/graphql';
import { SkillCategory } from '../../generated/prisma/client.js';

@InputType()
export class CreateSkillInput {
  @Field()
  name: string;

  @Field(() => SkillCategory)
  category: SkillCategory;

  @Field(() => Int)
  level: number;

  @Field(() => Int)
  order: number;
}
