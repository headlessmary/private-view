const bcrypt = require("bcrypt");
const prisma = require("../database/prisma");

async function createAdmin() {
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: "admin@privateview.com",
      },
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin123@", 10);

    await prisma.admin.create({
      data: {
        email: "admin@privateview.com",
        password: hashedPassword,
      },
    });

    console.log("✅ Admin created successfully.");
    console.log("Email: admin@privateview.com");
    console.log("Password: Admin123@");

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();