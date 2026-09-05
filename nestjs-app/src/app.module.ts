import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { validate } from './config/env.schema.js';
import { ProfileModule } from './profile/profile.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { SkillsModule } from './skills/skills.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ReviewsModule } from './reviews/reviews.module.js';
import { LinksModule } from './links/links.module.js';
import { ExperienceModule } from './experience/experience.module.js';
import { UploadModule } from './upload/upload.module.js';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validate
  }), ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'public'),
    serveRoot: '/public'
  }), PrismaModule, GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    playground: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault()]
  }), ProfileModule, ProjectsModule, SkillsModule, ReviewsModule, LinksModule, ExperienceModule, UploadModule],
  providers: []
})
export class AppModule {}