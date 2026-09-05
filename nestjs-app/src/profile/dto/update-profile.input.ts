import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true }) @IsOptional() name?: string;
  @Field({ nullable: true }) @IsOptional() headline?: string;
  @Field({ nullable: true }) @IsOptional() description?: string;
  @Field({ nullable: true }) @IsOptional() location?: string;
  @Field({ nullable: true }) @IsOptional() @IsEmail() email?: string;
}