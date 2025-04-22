import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';


const prisma = new PrismaClient();


function generateUniqueDatabaseURL(schemaId: string): string {
  if(!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }
  
  const url = new URL(process.env.DATABASE_URL);

  const databaseName = `test_${schemaId}`;
  const pathParts = url.pathname.split('/').filter(Boolean);
  pathParts[0] = databaseName;
  url.pathname = `/${pathParts.join('/')}`;

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS \`test_${schemaId}\`;`);
  await prisma.$disconnect();
});