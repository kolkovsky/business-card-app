import { z } from 'zod';

/**
 * Single source of truth for runtime configuration.
 * The app refuses to start if the environment does not match this schema.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      {
        message: 'DATABASE_URL must be a PostgreSQL connection string',
      },
    ),
  GRAPHQL_MAX_DEPTH: z.coerce.number().int().positive().default(6),
  LOG_SQL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${details}`);
  }
  return result.data;
}
