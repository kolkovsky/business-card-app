import { validateEnv } from './env.schema';

describe('validateEnv', () => {
  const DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

  it('applies defaults', () => {
    expect(validateEnv({ DATABASE_URL })).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      DATABASE_URL,
      GRAPHQL_MAX_DEPTH: 6,
      LOG_SQL: false,
      TRUST_PROXY_HOPS: 0,
    });
  });

  it('coerces numeric and boolean values', () => {
    const env = validateEnv({ DATABASE_URL, PORT: '8080', LOG_SQL: 'true' });
    expect(env.PORT).toBe(8080);
    expect(env.LOG_SQL).toBe(true);
  });

  it('fails fast on missing DATABASE_URL', () => {
    expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
  });

  it('rejects non-PostgreSQL urls', () => {
    expect(() => validateEnv({ DATABASE_URL: 'mysql://localhost/db' })).toThrow(
      /PostgreSQL/,
    );
  });
});
