import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const employeePassword = await bcrypt.hash('employee123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trackshift.com' },
    update: {},
    create: {
      email: 'admin@trackshift.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create employee user
  const employee = await prisma.user.upsert({
    where: { email: 'employee@trackshift.com' },
    update: {},
    create: {
      email: 'employee@trackshift.com',
      name: 'John Doe',
      password: employeePassword,
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Created employee user:', employee.email);

  // Create a sample schedule template for the employee
  const today = new Date();
  const scheduleTemplate = await prisma.scheduleTemplate.create({
    data: {
      userId: employee.id,
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '17:00',
      effectiveFrom: today,
      isActive: true,
    },
  });

  console.log('Created schedule template:', scheduleTemplate.id);

  // Create a scheduled shift for today (if today is a weekday)
  const dayOfWeek = today.getDay();
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const scheduledStart = new Date(today);
    scheduledStart.setHours(9, 0, 0, 0);
    
    const scheduledEnd = new Date(today);
    scheduledEnd.setHours(17, 0, 0, 0);

    const shift = await prisma.shift.create({
      data: {
        userId: employee.id,
        scheduledStart,
        scheduledEnd,
        status: 'SCHEDULED',
      },
    });

    console.log('Created scheduled shift for today:', shift.id);
  }

  // Create an audit log
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SEED_DATABASE',
      entityType: 'SYSTEM',
      metadata: {
        message: 'Database seeded with initial data',
      },
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
