import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class ProjectImageType {
  @Field(() => ID) id: string;
  @Field() url: String;
  @Field(() => Int) order: number;
}
@ObjectType()
export class ProjectType {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() description: string;
  @Field({ nullable: true }) repoUrl?: string;
  @Field({ nullable: true }) liveUrl?: string;
  @Field(() => [String]) stack: string[];
  @Field(() => Int) order: number;
  @Field(() => [ProjectImageType])
  images: ProjectImageType[];
}
