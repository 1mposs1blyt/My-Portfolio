import { InputType, Field, Int } from '@nestjs/graphql';
import {
    IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Language } from '../../generated/prisma/client.js';

@InputType()
export class CreateReviewInput {
  @Field() @IsUUID() token: string;
  @Field() @IsString() @IsNotEmpty() authorName: string;
  @Field({ nullable: true }) @IsOptional() @IsString() company?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() position?: string;
  @Field() @IsString() @IsNotEmpty() text: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
  @Field(() => Language, { nullable: true, defaultValue: Language.RU })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
