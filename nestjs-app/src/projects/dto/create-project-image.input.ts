import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateProjectImageInput {
  @Field(() => ID)
  @IsUUID()
  projectId: string;

  @Field()
  @IsString() @IsNotEmpty()
  url: string;

  @Field(() => Int, { nullable: true })
  @IsOptional() @IsInt()
  order?: number;
}