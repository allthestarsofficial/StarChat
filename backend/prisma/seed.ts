import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed your database here
  console.log('Seeding database...');
  // Example:
  // await prisma.user.create({
  //   data: {
  //     email: 'test@example.com',
  //     username: 'testuser',
  //     password: 'hashedpassword',
  //   },
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
