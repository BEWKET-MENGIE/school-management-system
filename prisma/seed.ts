import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt'; 
// Note: if you use 'bcryptjs', change the import above to: import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Hash the password exactly how NestJS expects it
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 2. Create the user and the linked Admin profile
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {
      passwordHash: hashedPassword, // Updates the password if the user already exists
    },
    create: {
      email: 'admin@school.com',
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
      admin: {
        create: {
          firstName: 'System',
          lastName: 'Admin',
        },
      },
    },
  });

  console.log('✅ Admin user ready:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });