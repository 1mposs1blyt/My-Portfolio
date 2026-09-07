import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { LinkKind } from '../../generated/prisma/client.js';
import { ProjectType } from '../../projects/dto/projects.type.js';
import { SkillType } from '../../skills/dto/skills.type.js';
import { Language } from '../../generated/prisma/client.js';

registerEnumType(LinkKind, {
  name: 'LinkKind'
});

registerEnumType(Language, {
  name: 'Language',
  description: 'Поддерживаемые языки локализации сайта',
});

@ObjectType()
export class ProfileLinkType {
  @Field(() => ID)
  id: string;

  @Field(() => LinkKind)
  kind: LinkKind;

  @Field()
  label: string;

  @Field()
  url: string;

  @Field(() => Int)
  order: number;
}

@ObjectType()
export class AchievementType {
  @Field(() => ID)
  id: string;

  @Field() // Сюда будет маппиться text из achievementTranslations
  text: string;

  @Field(() => Int)
  order: number;
}

@ObjectType()
export class ExperienceType {
  @Field(() => ID)
  id: string;

  @Field()
  company: string;

  @Field() // Сюда придет локализованный position
  position: string;

  @Field({ nullable: true }) // Сюда придет локализованный description
  description?: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => [AchievementType])
  achievements: AchievementType[];
}

// Добавим вспомогательный тип для каунтеров, который нужен вашей функции getLocalization
@ObjectType()
export class ProfileCountsType {
  @Field(() => Int)
  projects: number;

  @Field(() => Int)
  reviews: number;
}

@ObjectType()
export class ProfileType {
  @Field(() => ID)
  id: string;

  @Field() // Локализованное имя
  name: string;

  @Field() // Локализованный тайтл
  headline: string;

  @Field() // Локализованное описание
  description: string;

  @Field()
  email: string;

  @Field({ nullable: true }) // Локализованный город/страна
  location?: string;

  @Field(() => ProfileCountsType) // Каунтеры для терминала
  counts: ProfileCountsType;

  @Field(() => [ProfileLinkType])
  links: ProfileLinkType[];

  @Field(() => [SkillType])
  skills: SkillType[];

  @Field(() => [ExperienceType])
  experience: ExperienceType[];

  @Field(() => [ProjectType])
  projects: ProjectType[];
}
