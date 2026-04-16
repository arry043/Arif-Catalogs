import { prisma } from './src/lib/prisma';

async function testConnection() {
  console.log('Testing database connection...');
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    const categoryCount = await prisma.category.count();
    console.log(`✅ Table access verified. Category count: ${categoryCount}`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Connection failed!');
    console.error(`Error Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
    process.exit(1);
  }
}

testConnection();
