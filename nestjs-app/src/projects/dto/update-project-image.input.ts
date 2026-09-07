import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Language } from '../../generated/prisma/client.js';
@InputType()
export class UpdateProjectImageInput {
  @Field(() => ID)
  @IsUUID()
  id: string;
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  url?: string;
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  order?: number;
@Field(() => Language, { nullable: true, defaultValue: Language.RU })
language?: Language;
}
