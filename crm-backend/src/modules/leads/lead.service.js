const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { addTimelineEvent } = require("./lead.timeline");
const { calculateLeadScore, getScoreDelta } = require("./lead.scoring");

/**
 * ===============================
 * INTERNAL — LOCK CHECK
 * ===============================
 */
async function assertLeadEditable(leadId, user) {
  const lead = await prisma.lead.findFirst({
    where: {
      lead_id: leadId,
      company_id: user.company_id,
    },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (lead.lead_status === "Converted") {
    throw new Error("Converted leads are locked and cannot be modified");
  }

  return lead;
}

/**
 * ===============================
 * CREATE LEAD
 * ===============================
 */
exports.createLead = async (data, user) => {
  if (data.email || data.phone) {
    const duplicate = await prisma.lead.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : undefined,
          data.phone ? { phone: data.phone } : undefined,
        ].filter(Boolean),
      },
    });

    if (duplicate) {
      throw new Error("Duplicate lead found (email or phone already exists)");
    }
  }

  const lead = await prisma.lead.create({
    data: {
      ...data,
      company_id: user.company_id,
      branch_id: user.branch_id,
      assigned_to: user.userId,
      lead_score: calculateLeadScore({
        ...data,
        lead_status: "New",
      }),
    },
  });

  await addTimelineEvent(
    lead.lead_id,
    "LEAD_CREATED",
    "Lead created"
  );

  return lead;
};

/**
 * ===============================
 * GET LEADS (FILTER + PAGINATION)
 * ===============================
 */
exports.getLeads = async (query, user) => {
  const {
    status,
    assigned_to,
    source,
    search,
    page = 1,
    limit = 10,
    sort = "desc",
  } = query;

  const where = {
    company_id: user.company_id,
  };

  if (status) where.lead_status = status;
  if (assigned_to) where.assigned_to = assigned_to;
  if (source) where.lead_source = source;

  if (search) {
    where.OR = [
      { first_name: { contains: search, mode: "insensitive" } },
      { last_name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [total, data] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        created_at: sort === "asc" ? "asc" : "desc",
      },
    }),
  ]);

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    data,
  };
};

/**
 * ===============================
 * GET SINGLE LEAD
 * ===============================
 */
exports.getLeadById = async (id, user) => {
  const lead = await prisma.lead.findFirst({
    where: {
      lead_id: id,
      company_id: user.company_id,
      OR: [
        { assigned_to: user.userId },
        { branch_id: user.branch_id },
      ],
    },
    include: {
      Timeline: true,
    },
  });

  if (!lead) {
    throw new Error("Lead not found or access denied");
  }

  return lead;
};

/**
 * ===============================
 * UPDATE LEAD
 * ===============================
 */
exports.updateLead = async (id, data, user) => {
  // 🔐 LOCK CHECK
  await assertLeadEditable(id, user);

  const lead = await prisma.lead.update({
    where: { lead_id: id },
    data,
  });

  await addTimelineEvent(
    id,
    "LEAD_UPDATED",
    "Lead updated"
  );

  return lead;
};

/**
 * ===============================
 * DELETE LEAD
 * ===============================
 */
exports.deleteLead = async (id, user) => {
  // 🔐 LOCK CHECK
  await assertLeadEditable(id, user);

  await prisma.lead.delete({
    where: { lead_id: id },
  });

  await addTimelineEvent(
    id,
    "LEAD_DELETED",
    "Lead deleted"
  );
};

/**
 * ===============================
 * ASSIGN / REASSIGN LEAD
 * ===============================
 */
exports.assignLead = async (leadId, newOwnerId, user) => {
  // 🔐 LOCK CHECK
  const lead = await assertLeadEditable(leadId, user);

  if (lead.assigned_to === newOwnerId) {
    throw new Error("Lead already assigned to this user");
  }

  const previousOwner = lead.assigned_to;

  const updatedLead = await prisma.lead.update({
    where: { lead_id: leadId },
    data: {
      assigned_to: newOwnerId,
    },
  });

  await addTimelineEvent(
    leadId,
    previousOwner ? "LEAD_REASSIGNED" : "LEAD_ASSIGNED",
    previousOwner
      ? `Reassigned from ${previousOwner} to ${newOwnerId}`
      : `Assigned to ${newOwnerId}`
  );

  return updatedLead;
};

/**
 * ===============================
 * UPDATE LEAD STATUS
 * ===============================
 */
exports.updateLeadStatus = async (leadId, newStatus, user) => {
  // 🔐 LOCK CHECK
  const lead = await assertLeadEditable(leadId, user);

  if (lead.lead_status === newStatus) {
    throw new Error("Lead already in this status");
  }

  const scoreDelta = getScoreDelta(newStatus);

  const updatedLead = await prisma.lead.update({
    where: { lead_id: leadId },
    data: {
      lead_status: newStatus,
      lead_score: lead.lead_score + scoreDelta,
    },
  });

  await addTimelineEvent(
    leadId,
    "STATUS_CHANGED",
    `Status changed from ${lead.lead_status} → ${newStatus} (${scoreDelta >= 0 ? "+" : ""}${scoreDelta})`
  );

  return updatedLead;
};

/**
 * ===============================
 * CONVERT LEAD → ACCOUNT
 * ===============================
 */
exports.convertLeadToContact = async (leadId, user) => {
  const lead = await prisma.lead.findFirst({
    where: {
      lead_id: leadId,
      company_id: user.company_id,
    },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (lead.lead_status === "Converted") {
    throw new Error("Lead already converted");
  }

  // Create Account
  const account = await prisma.account.create({
    data: {
      company_name: lead.company_name || lead.last_name || "Individual",
      company_id: user.company_id,
      lead_id: lead.lead_id,
    },
  });

  // 🔒 Lock Lead
  await prisma.lead.update({
    where: { lead_id: leadId },
    data: {
      lead_status: "Converted",
    },
  });

  // Timeline
  await addTimelineEvent(
    lead.lead_id,
    "LEAD_CONVERTED",
    `Lead converted to account ${account.company_name}`
  );

  return { lead, account };
};
