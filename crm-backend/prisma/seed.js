const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ROLES = ["ADMIN", "SALES_MANAGER", "SALES_REP"];

const PERMISSIONS = [
  "LEADS_READ",
  "LEADS_WRITE",
  "LEADS_ASSIGN",
  "LEADS_CONVERT",
  "DEALS_READ",
  "DEALS_WRITE",
  "DEALS_UPDATE_STAGE",
  "DEALS_FORECAST"
];

async function seedRBAC() {
  console.log("🌱 Seeding RBAC...");

  // Roles
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
        description: `${role} system role`
      }
    });
  }

  // Permissions
  for (const code of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code },
      update: {},
      create: {
        code,
        description: `Permission for ${code}`
      }
    });
  }

  // Give ADMIN all permissions
  const adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" }
  });

  const allPerms = await prisma.permission.findMany();

  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.role_id,
          permission_id: perm.permission_id
        }
      },
      update: {},
      create: {
        role_id: adminRole.role_id,
        permission_id: perm.permission_id
      }
    });
  }

  console.log("✅ ADMIN granted all permissions");
}

async function seedUsers() {
  console.log("👤 Seeding users...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@crm.com" },
    update: {},
    create: {
      first_name: "System",
      last_name: "Admin",
      email: "admin@crm.com",
      password_hash: "admin123", // hash in production
      company_id: "company-1",
      branch_id: "branch-1"
    }
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@crm.com" },
    update: {},
    create: {
      first_name: "Sales",
      last_name: "Manager",
      email: "manager@crm.com",
      password_hash: "manager123",
      company_id: "company-1",
      branch_id: "branch-1"
    }
  });

  const rep = await prisma.user.upsert({
    where: { email: "rep@crm.com" },
    update: {},
    create: {
      first_name: "Sales",
      last_name: "Rep",
      email: "rep@crm.com",
      password_hash: "rep123",
      company_id: "company-1",
      branch_id: "branch-1"
    }
  });

  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  const managerRole = await prisma.role.findUnique({ where: { name: "SALES_MANAGER" } });
  const repRole = await prisma.role.findUnique({ where: { name: "SALES_REP" } });

  // Assign roles
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: admin.user_id,
        role_id: adminRole.role_id
      }
    },
    update: {},
    create: {
      user_id: admin.user_id,
      role_id: adminRole.role_id
    }
  });

  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: manager.user_id,
        role_id: managerRole.role_id
      }
    },
    update: {},
    create: {
      user_id: manager.user_id,
      role_id: managerRole.role_id
    }
  });

  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: rep.user_id,
        role_id: repRole.role_id
      }
    },
    update: {},
    create: {
      user_id: rep.user_id,
      role_id: repRole.role_id
    }
  });

  console.log("✅ Users created & roles assigned");
}

async function seedLeads() {
  console.log("🌱 Seeding leads...");

  await prisma.leadTimeline.deleteMany({});
  await prisma.lead.deleteMany({});

  await prisma.lead.create({
    data: {
      lead_id: "lead-001",
      first_name: "Rohit",
      last_name: "Kharode",
      email: "rohit@gmail.com",
      phone: "9999999999",
      lead_source: "Website",
      lead_status: "New",
      company_id: "company-1",
      branch_id: "branch-1",
      assigned_to: "admin@crm.com",
      lead_score: 0
    }
  });

  await prisma.lead.create({
    data: {
      lead_id: "lead-002",
      first_name: "Shivam",
      last_name: "Patil",
      email: "shivam@gmail.com",
      phone: "8888888888",
      lead_source: "Facebook",
      lead_status: "Contacted",
      company_id: "company-1",
      branch_id: "branch-1",
      assigned_to: "rep@crm.com",
      lead_score: 10
    }
  });

  console.log("✅ Leads seeded");
}

async function main() {
  console.log("🚀 Starting Enterprise Seed...");

  await seedRBAC();
  await seedUsers();
  await seedLeads();

  console.log("🎉 Full CRM + RBAC Seed Complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
