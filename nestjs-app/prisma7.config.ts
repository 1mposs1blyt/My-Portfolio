import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  migrations: {
    seed: 'node --import tsx/esm ./prisma/seed.ts',
  },
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
