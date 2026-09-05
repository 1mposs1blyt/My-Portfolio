import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateExperienceInput } from './create-experience.input.js';
@InputType()
export class UpdateExperienceInput extends PartialType(CreateExperienceInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}