import { Module } from '@nestjs/common';
import { LinksResolver } from './links.resolver.js';
import { LinksService } from './links.service.js';

@Module({
  providers: [LinksResolver, LinksService],
})
export class LinksModule {}