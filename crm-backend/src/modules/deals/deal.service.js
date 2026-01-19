// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// const { DEAL_STAGES, STAGE_PROBABILITY } = require("./deal.pipeline");
// const { addDealTimelineEvent } = require("./deal.timeline");
// const { validateStage } = require("./deal.pipeline")
// /**
//  * CREATE DEAL
//  */
// exports.createDeal = async (data, user) => {
//   if (!data.account_id || !data.contact_id || !data.lead_id) {
//     throw new Error("Lead, Account and Contact are required to create a deal");
//   }

//   return prisma.deal.create({
//     data: {
//       ...data,
//       company_id: user.company_id,
//       branch_id: user.branch_id,
//       probability: STAGE_PROBABILITY.Qualification,
//     },
//   });
// };

// /**
//  * GET DEALS
//  */
// exports.getDeals = async (query, user) => {
//   return prisma.deal.findMany({
//     where: {
//       company_id: user.company_id,
//     },
//     orderBy: { created_at: "desc" },
//   });
// };

// /**
//  * UPDATE STAGE
//  */
// exports.updateDealStage = async (dealId, newStage, user) => {
//   if (!DEAL_STAGES.includes(newStage)) {
//     throw new Error("Invalid deal stage");
//   }

//   const deal = await prisma.deal.findFirst({
//     where: {
//       deal_id: dealId,
//       company_id: user.company_id,
//     },
//   });

//   if (!deal) throw new Error("Deal not found");

//   const updatedDeal = await prisma.deal.update({
//     where: { deal_id: dealId },
//     data: {
//       stage: newStage,
//       probability: STAGE_PROBABILITY[newStage],
//       status: newStage === "Won" ? "Won" : newStage === "Lost" ? "Lost" : "Open",
//     },
//   });

//   await addDealTimelineEvent(
//     dealId,
//     "STAGE_CHANGED",
//     `Stage changed from ${deal.stage} → ${newStage}`
//   );

//   return updatedDeal;
// };
// exports.getRevenueForecast = async (user) => {
//   const deals = await prisma.deal.findMany({
//     where: {
//       company_id: user.company_id,
//       status: "Open",
//     },
//   });

//   const forecast = deals.reduce((sum, d) => {
//     return sum + ((d.amount || 0) * d.probability) / 100;
//   }, 0);

//   return { forecast, total_open_deals: deals.length };
// };
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { STAGE_PROBABILITY, validateStage } = require("./deal.pipeline");
const { addDealTimelineEvent } = require("./deal.timeline");

/**
 * CREATE DEAL
 */
exports.createDeal = async (data, user) => {
  if (!data.title || !data.value) {
    throw new Error("Deal must have title and value");
  }

  const deal = await prisma.deal.create({
    data: {
      ...data,
      company_id: user.company_id,
      branch_id: user.branch_id,
      probability: STAGE_PROBABILITY.Qualification,
      stage: "Qualification",
      status: "Open",
    },
  });

  await addDealTimelineEvent(
    deal.deal_id,
    "DEAL_CREATED",
    `Deal ${deal.title} created`,
    user.userId
  );

  return deal;
};

/**
 * GET ALL DEALS
 */
exports.getDeals = async (query, user) => {
  return prisma.deal.findMany({
    where: { company_id: user.company_id },
    orderBy: { created_at: "desc" },
  });
};

/**
 * UPDATE DEAL STAGE
 */
exports.updateDealStage = async (dealId, newStage, user) => {
  const deal = await prisma.deal.findFirst({
    where: { deal_id: dealId, company_id: user.company_id },
  });

  if (!deal) throw new Error("Deal not found");

  if (!validateStage(deal.stage, newStage)) {
    throw new Error(`Invalid stage transition: ${deal.stage} → ${newStage}`);
  }

  const updatedDeal = await prisma.deal.update({
    where: { deal_id: dealId },
    data: {
      stage: newStage,
      probability: STAGE_PROBABILITY[newStage],
      status:
        newStage === "Won"
          ? "Won"
          : newStage === "Lost"
          ? "Lost"
          : "Open",
    },
  });

  await addDealTimelineEvent(
    dealId,
    "DEAL_STAGE_CHANGED",
    `Stage changed from ${deal.stage} → ${newStage}`,
    user.userId
  );

  return updatedDeal;
};
