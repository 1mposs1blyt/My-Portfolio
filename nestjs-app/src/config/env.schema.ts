import { z } from 'zod';
export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL обязателен'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
});
export type Env = z.infer<typeof envSchema>;
export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Ошибка в файле .env:\n${JSON.stringify(result.error.format(), null, 2)}`);
  }
  return result.data;
}