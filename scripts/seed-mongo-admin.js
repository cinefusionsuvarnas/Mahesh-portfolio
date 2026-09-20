const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin123';
  
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.create({
    data: {
      username,
      passwordHash
    }
  });

  console.log('Created admin user:', admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
