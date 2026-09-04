import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '../../generated/prisma/client.js';

registerEnumType(SkillCategory, { name: 'SkillCategory' });

@ObjectType()
export class SkillType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field(() => SkillCategory) category: SkillCategory;
  @Field(() => Int) level: number;
  @Field(() => Int) order: number;
}
