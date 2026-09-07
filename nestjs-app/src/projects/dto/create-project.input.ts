import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Language } from '../../generated/prisma/client.js';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  repoUrl?: string;
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;
  @Field(() => [String])
  @IsArray()
  @IsString({
    each: true,
  })
  stack: string[];
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  order?: number;
  @Field(() => Language, { nullable: true, defaultValue: Language.RU })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
