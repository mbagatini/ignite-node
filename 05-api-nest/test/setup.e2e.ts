import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll } from 'vitest';

/**
 * Creates a database to run the end to end tests with Prisma
 */

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();
const prisma = new PrismaClient();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  console.log('--> ⬆️ preparing database for e2e tests: \n ' + databaseURL);

  process.env.DATABASE_URL = databaseURL;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  console.log('--> ⏹️ droping database of e2e tests');
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
