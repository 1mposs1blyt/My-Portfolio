import { Module } from '@nestjs/common';
import { ProfileResolver } from './profile.resolver.js';

@Module({
  providers: [ProfileResolver],
})

export class ProfileModule {}
