import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SkillCategory } from '../../generated/prisma/client.js';
@InputType()
export class CreateSkillInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;
  @Field(() => SkillCategory)
  @IsEnum(SkillCategory)
  category: SkillCategory;
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  level?: number;
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  order?: number;
}
