import { PrismaClient } from '@prisma/client';

async function run() {
  console.log('Testing Prisma 7 Client instantiation...');
  try {
    const prisma = new PrismaClient();
    console.log('✅ PrismaClient instantiated.');
    await prisma.$connect();
    console.log('✅ Prisma connected.');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Failed!');
    console.error(err);
    process.exit(1);
  }
}

run();
