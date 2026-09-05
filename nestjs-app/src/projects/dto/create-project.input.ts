import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
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
    nullable: true
  })
  @IsOptional()
  @IsUrl()
  repoUrl?: string;
  @Field({
    nullable: true
  })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;
  @Field(() => [String])
  @IsArray()
  @IsString({
    each: true
  })
  stack: string[];
  @Field(() => Int, {
    nullable: true
  })
  @IsOptional()
  @IsInt()
  order?: number;
}