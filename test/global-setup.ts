import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { applyTestEnv, TEST_DATABASE_URL } from './test-env';

/**
 * Prepares an isolated test database once per test run:
 * applies migrations (creating the database if needed) and empties all tables.
 * Refuses to run against anything that is not a *_test database.
 */
export default async function globalSetup(): Promise<void> {
  const dbName = new URL(TEST_DATABASE_URL).pathname.slice(1);
  if (!dbName.endsWith('_test')) {
    throw new Error(
      `Refusing to run e2e tests against "${dbName}": database name must end with "_test"`,
    );
  }

  applyTestEnv();
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });

  const prisma = new PrismaClient({ datasourceUrl: TEST_DATABASE_URL });
  try {
    // Every other table references Profile with ON DELETE CASCADE
    await prisma.$executeRawUnsafe(
      'TRUNCATE TABLE "Profile" RESTART IDENTITY CASCADE',
    );
  } finally {
    await prisma.$disconnect();
  }
}
