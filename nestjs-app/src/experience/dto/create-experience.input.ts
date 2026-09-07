import { InputType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Language } from '../../generated/prisma/client.js';

@InputType()
export class CreateExperienceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  company: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  position: string;
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;
  @Field(() => Date)
  @Type(() => Date)
  @IsDate()
  startDate: Date;
  @Field(() => Date, {
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
  @Field(() => [String], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
  })
  achievements?: string[];

  @Field(() => Language, { nullable: true, defaultValue: Language.RU })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
