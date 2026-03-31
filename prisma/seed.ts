import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('123456', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: { role: UserRole.ADMIN },
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

  const pkgCount = await prisma.package.count();
  if (pkgCount === 0) {
    await prisma.package.create({
      data: {
        name: 'Paket Silver',
        description: 'Dekorasi basic pelaminan + aisle + lighting.',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
        items: {
          create: [
            { itemName: 'Backdrop Pelaminan', quantity: 1, unitPrice: 4500000, totalPrice: 4500000 },
            { itemName: 'Dekor Aisle', quantity: 1, unitPrice: 2500000, totalPrice: 2500000 },
            { itemName: 'Lighting', quantity: 1, unitPrice: 1500000, totalPrice: 1500000 }
          ]
        }
      }
    });
  }
}

main().finally(async () => prisma.$disconnect());
