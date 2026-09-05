import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateProjectImageInput {
  @Field(() => ID) @IsUUID() id: string;

  @Field({ nullable: true })
  @IsOptional() @IsString() @IsNotEmpty()
  url?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional() @IsInt()
  order?: number;
}