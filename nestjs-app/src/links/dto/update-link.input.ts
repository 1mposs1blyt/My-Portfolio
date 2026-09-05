import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateLinkInput } from './create-link.input.js';

@InputType()
export class UpdateLinkInput extends PartialType(CreateLinkInput) {
  @Field(() => ID) @IsUUID() id: string;
}