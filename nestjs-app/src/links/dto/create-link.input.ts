import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LinkKind } from '../../generated/prisma/client.js';
@InputType()
export class CreateLinkInput {
  @Field(() => LinkKind)
  @IsEnum(LinkKind)
  kind: LinkKind;
  @Field()
  @IsString()
  @IsNotEmpty()
  label: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  url: string;
  @Field(() => Int, {
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  order?: number;
}
