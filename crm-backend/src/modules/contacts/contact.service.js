const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const accountService = require("../accounts/account.service");
const TIMELINE_EVENTS = require("../common/constants/timelineEvents");

exports.convertLeadToContact = async (leadId, user) => {
  // 1️⃣ Get Lead
  const lead = await prisma.lead.findFirst({
    where: {
      lead_id: leadId,
      company_id: user.companyId,
    },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (lead.lead_status === "Converted") {
    throw new Error("Lead already converted");
  }

  // 2️⃣ Create / Find Account
  const account = await accountService.findOrCreateAccount(lead, user);

  // 3️⃣ Create Contact
  const contact = await prisma.contact.create({
    data: {
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone,
      lead_id: lead.lead_id,
      account_id: account.account_id,
      company_id: user.companyId,
      branch_id: user.branchId,
    },
  });

  // 4️⃣ Update Lead
  await prisma.lead.update({
    where: { lead_id: leadId },
    data: { lead_status: "Converted" },
  });

  // 5️⃣ Timeline Event
  await prisma.leadTimeline.create({
    data: {
      lead_id: leadId,
      event_type: TIMELINE_EVENTS.LEAD_CONVERTED,
      event_by: user.userId,
      meta: JSON.stringify({
        contact_id: contact.contact_id,
        account_id: account.account_id,
      }),
    },
  });

  return {
    contact,
    account,
  };
};
