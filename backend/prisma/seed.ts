import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Beauty',
];

const TAGS = [
  'wireless',
  'bluetooth',
  'portable',
  'durable',
  'eco-friendly',
  'premium',
  'bestseller',
  'new-arrival',
  'limited-edition',
  'refurbished',
];

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categoryRecords = await Promise.all(
    CATEGORIES.map((name) =>
      prisma.category.create({
        data: { name },
      })
    )
  );

  const products = [];

  // Generate 200+ products
  for (let i = 1; i <= 210; i++) {
    const category = categoryRecords[Math.floor(Math.random() * categoryRecords.length)];
    const price = Number((Math.random() * 500 + 1).toFixed(2));
    const stock = Math.floor(Math.random() * 100);
    const rating = Number((Math.random() * 5).toFixed(2));
    const productTags = TAGS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1);

    products.push({
      name: `Product ${i}: ${category.name} Item`,
      description: `Detailed description for product ${i}. This high-quality ${category.name} item features ${productTags.join(', ')}.`,
      categoryId: category.id,
      price,
      stock,
      rating,
      tags: productTags.join(','),
      isActive: i % 25 !== 0, // Every 25th product is inactive
    });
  }

  // Add specific edge cases
  products.push({
    name: 'Vintage Wireless Headphones',
    description: 'High-end wireless headphones with noise cancellation.',
    categoryId: categoryRecords.find(c => c.name === 'Electronics')!.id,
    price: 299.99,
    stock: 0, // Out of stock
    rating: 4.8,
    tags: 'wireless,bluetooth,premium',
    isActive: true,
  });

  products.push({
    name: 'Super Expensive Luxury Watch',
    description: 'A masterpiece of engineering and design.',
    categoryId: categoryRecords.find(c => c.name === 'Electronics')!.id,
    price: 9999.00, // Max price
    stock: 5,
    rating: 5.0, // Max rating
    tags: 'premium,limited-edition',
    isActive: true,
  });

  products.push({
    name: 'Cheap Budget Pen',
    description: 'Practical and affordable.',
    categoryId: categoryRecords.find(c => c.name === 'Books')!.id,
    price: 1.00, // Min price
    stock: 1000,
    rating: 3.2,
    tags: 'portable',
    isActive: true,
  });

  products.push({
    name: 'Discontinued Old Model',
    description: 'No longer available for purchase.',
    categoryId: categoryRecords.find(c => c.name === 'Electronics')!.id,
    price: 150.00,
    stock: 0,
    rating: 2.5,
    tags: 'refurbished',
    isActive: false, // Inactive
  });

  // Bulk create
  await prisma.product.createMany({
    data: products,
  });

  console.log(`Seeded ${products.length} products and ${categoryRecords.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
