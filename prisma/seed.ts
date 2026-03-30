import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('123456', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@gmail.com',
      passwordHash: hash,
      address: 'Jakarta',
      phone: '08123456789',
      role: UserRole.ADMIN
    }
  });

  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id
    }
  });
}

main().finally(async () => prisma.$disconnect());
