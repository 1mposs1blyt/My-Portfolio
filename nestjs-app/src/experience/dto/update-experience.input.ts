import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CreateExperienceInput } from './create-experience.input.js';
import { Language } from '../../generated/prisma/client.js';
@InputType()
export class UpdateExperienceInput extends PartialType(CreateExperienceInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
