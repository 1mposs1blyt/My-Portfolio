import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateProjectInput } from './create-project.input.js';
import { IsUUID } from 'class-validator';
@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}