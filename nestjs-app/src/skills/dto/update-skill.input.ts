import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateSkillInput } from './create-skill.input.js';

@InputType()
export class UpdateSkillInput extends PartialType(CreateSkillInput) {
  @Field(() => ID)
  id: string;
}
