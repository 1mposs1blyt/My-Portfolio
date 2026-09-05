import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateSkillInput } from './create-skill.input.js';
@InputType()
export class UpdateSkillInput extends PartialType(CreateSkillInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}