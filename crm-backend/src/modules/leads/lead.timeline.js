const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addTimelineEvent = async (leadId, action, note = "") => {
  return prisma.leadTimeline.create({
    data: {
      lead_id: leadId,
      action,
      note,
    },
  });
};

