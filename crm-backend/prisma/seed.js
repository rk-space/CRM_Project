const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Delete child records first
  await prisma.leadTimeline.deleteMany({});
  console.log("🧹 Lead timelines deleted");

  // 2️⃣ Then delete parent records
  await prisma.lead.deleteMany({});
  console.log("🧹 Leads deleted");

  // 3️⃣ Seed fresh leads
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
      assigned_to: "user-123",
      lead_score: 0,
    },
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
      assigned_to: "user-456",
      lead_score: 10,
    },
  });

  console.log("✅ Leads seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
