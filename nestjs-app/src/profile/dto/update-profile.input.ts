import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Language } from '../../generated/prisma/client.js';
@InputType()
export class UpdateProfileInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  name?: string;
  @Field({
    nullable: true,
  })
  @IsOptional()
  headline?: string;
  @Field({
    nullable: true,
  })
  @IsOptional()
  description?: string;
  @Field({
    nullable: true,
  })
  @IsOptional()
  location?: string;
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
  @Field(() => Language, {
    nullable: true,
    defaultValue: Language.RU,
  })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
