import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from './env.schema';

/** Typed facade over ConfigService so consumers never deal with raw strings. */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  get nodeEnv(): Env['NODE_ENV'] {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get port(): number {
    return this.config.get('PORT', { infer: true });
  }

  get databaseUrl(): string {
    return this.config.get('DATABASE_URL', { infer: true });
  }

  get graphqlMaxDepth(): number {
    return this.config.get('GRAPHQL_MAX_DEPTH', { infer: true });
  }

  get logSql(): boolean {
    return this.config.get('LOG_SQL', { infer: true });
  }
}
