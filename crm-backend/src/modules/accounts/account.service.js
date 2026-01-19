const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findOrCreateAccount = async (lead, user) => {
  // Find account dynamically
  let account = await prisma.account.findFirst({
    where: {
      company_name: lead.last_name || "Individual", // ✅ Correct field
      company_id: user.companyId,                   // dynamic from logged-in user
    },
  });

  // Create account if it doesn't exist
  if (!account) {
    account = await prisma.account.create({
      data: {
        account_id: "acc-" + Date.now(),           // unique ID
        company_name: lead.last_name || "Individual", // ✅ Correct field
        company_id: user.companyId,
        branch_id: user.branchId,
        lead_id: lead.lead_id,                     // link to lead
      },
    });
  }

  return account;
};
