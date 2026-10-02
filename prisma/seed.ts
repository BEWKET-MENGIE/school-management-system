import { PrismaClient, UserRole, TeacherStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Seed Teacher User & Profile
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      password: hashedPassword,
      role: UserRole.TEACHER,
      isActive: true,
      teacher: {
        create: {
          firstName: 'Sarah',
          lastName: 'Connor',
          phone: '+1234567890',
          status: TeacherStatus.ACTIVE,
        },
      },
    },
  });
  console.log(`✅ Teacher created: ${teacherUser.email}`);

  // 3. Find or Create Class Section
  let classSection = await prisma.classSection.findFirst({
    where: { sectionName: 'Grade 10-A', gradeLevel: 10 },
  });

  if (!classSection) {
    classSection = await prisma.classSection.create({
      data: {
        sectionName: 'Grade 10-A',
        gradeLevel: 10,
      },
    });
  }

  // 4. Seed Student User & Profile
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@school.com' },
    update: {},
    create: {
      email: 'student@school.com',
      password: hashedPassword,
      role: UserRole.STUDENT,
      isActive: true,
      student: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          admissionNumber: 'ADM-2026-001',
          gender: 'MALE',           // Passed as plain string
          currentGradeLevel: 10,
          section: {
            connect: { id: classSection.id },
          },
        },
      },
    },
  });
  console.log(`✅ Student created: ${studentUser.email}`);

  console.log('\n🎉 Seeding complete!');
  console.log('-------------------------------------------');
  console.log(`Default Credentials (Password for all: ${defaultPassword}):`);
  console.log(` - Admin:   admin@school.com`);
  console.log(` - Teacher: teacher@school.com`);
  console.log(` - Student: student@school.com`);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });