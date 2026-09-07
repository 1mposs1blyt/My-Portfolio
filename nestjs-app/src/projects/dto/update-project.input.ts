import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateProjectInput } from './create-project.input.js';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Language } from '../../generated/prisma/client.js';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
  @Field(() => Language, { nullable: true, defaultValue: Language.RU })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
