const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addDealTimelineEvent = async (
  dealId,
  action,
  note = "",
  userId = null
) => {
  return prisma.dealTimeline.create({
    data: {
      deal_id: dealId,
      action,
      note,
      user_id: userId,
    },
  });
};
