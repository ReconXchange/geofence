import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@trackshift.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@trackshift.com",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create employee user
  const employeePassword = await bcrypt.hash("employee123", 10);
  const employee = await prisma.user.upsert({
    where: { email: "employee@trackshift.com" },
    update: {},
    create: {
      name: "John Employee",
      email: "employee@trackshift.com",
      passwordHash: employeePassword,
      role: UserRole.EMPLOYEE,
    },
  });
  console.log("✅ Created employee user:", employee.email);

  // Create manager user
  const managerPassword = await bcrypt.hash("manager123", 10);
  const manager = await prisma.user.upsert({
    where: { email: "manager@trackshift.com" },
    update: {},
    create: {
      name: "Jane Manager",
      email: "manager@trackshift.com",
      passwordHash: managerPassword,
      role: UserRole.MANAGER,
    },
  });
  console.log("✅ Created manager user:", manager.email);

  console.log("🎉 Seeding completed!");
  console.log("\n📝 Test credentials:");
  console.log("Admin: admin@trackshift.com / admin123");
  console.log("Employee: employee@trackshift.com / employee123");
  console.log("Manager: manager@trackshift.com / manager123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
