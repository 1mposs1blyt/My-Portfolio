import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { nullable } from 'zod';
export enum ReviewKind {
  CLIENT = 'CLIENT',
  EMPLOYER = 'EMPLOYER'
}
registerEnumType(ReviewKind, {
  name: 'ReviewKind',
  description: 'Тип отзыва: CLIENT - заказчик проекта, EMPLOYER - работодатель'
});
@ObjectType()
export class ReviewType {
  @Field(() => ID)
  id: string;
  @Field(() => ReviewKind)
  type: ReviewKind;
  @Field()
  authorName: string;
  @Field({
    nullable: true
  })
  company?: string;
  @Field({
    nullable: true
  })
  position?: string;
  @Field()
  text: string;
  @Field(() => Int, {
    nullable: true
  })
  rating?: number;
  @Field({
    nullable: true
  })
  projectId?: string;
  @Field()
  createdAt: Date;
}
@ObjectType()
export class ReviewTokenValidType {
  @Field()
  isValid: boolean;
  @Field(() => ReviewKind, {
    nullable: true
  })
  type?: ReviewKind;
  @Field({
    nullable: true
  })
  projectId?: string;
  @Field({
    nullable: true
  })
  projectName?: string;
}