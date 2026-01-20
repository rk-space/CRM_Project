// // const prisma = require("../../database/prisma");
// // const { addTimelineEvent } = require("./lead.timeline");

// // /**
// //  * Convert Lead → Account + Contact + Deal
// //  * Business Rules:
// //  * 1. Lead must have budget, expectedClose, assigned_to
// //  * 2. Lead cannot be already converted
// //  * 3. Deal auto-created during conversion
// //  */
// // async function convertLead(leadId, user, dealInput) {
// //   return prisma.$transaction(async (tx) => {
// //     // 1️⃣ Fetch lead with company context
// //     const lead = await tx.lead.findFirst({
// //       where: {
// //         lead_id: leadId,
// //         company_id: user.company_id
// //       }
// //     });

// //     if (!lead) throw new Error("Lead not found");

// //     // 2️⃣ Mandatory Business Rules
// //     if (!lead.budget || !lead.expectedClose || !lead.assigned_to) {
// //       throw new Error("Budget, Expected Close Date, and Owner are required");
// //     }

// //     if (lead.status === "Converted") {
// //       throw new Error("Lead already converted");
// //     }

// //     // 3️⃣ Create Account
// // //   const account = await tx.account.create({
// // //   data: {
// // //     name: lead.company_name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unknown Company",
// // //     company_name: lead.company_name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unknown Company",
// // //     company_id: user.company_id,
// // //     branch_id: user.branch_id
// // //   }
// // // });
// // const account = await tx.account.create({
// //   data: {
// //     company_name: lead.company_name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || "Unknown Company",
// //     company_id: user.company_id,
// //     branch_id: user.branch_id
// //   }
// // });



// //     // 4️⃣ Create Contact
// // const contact = await tx.contact.create({
// //   data: {
// //     first_name: lead.first_name || "Unknown",
// //     last_name: lead.last_name || "Unknown",
// //     email: lead.email || "",
// //     phone: lead.phone || "",
// //     lead_id: lead.lead_id,
// //     company_id: user.company_id,
// //     branch_id: user.branch_id
// //   }
// // });

// //     // 5️⃣ Create Deal
// //    const deal = await tx.deal.create({
// //   data: {
// //     title: dealInput.title || `Deal for ${lead.first_name || ""} ${lead.last_name || ""}`.trim(),
// //     amount: dealInput.amount || lead.budget || 0,
// //     stage: "Qualification",
// //     probability: 10,
// //     lead_id: lead.lead_id,
// //     account_id: account.account_id,
// //     contact_id: contact.contact_id,
// //     company_id: user.company_id,
// //     branch_id: user.branch_id,
// //     owner_id: lead.assigned_to,
// //     status: "Open"
// //   }
// // });

// //     // 6️⃣ Update Lead status
// //     await tx.lead.update({
// //       where: { lead_id: lead.lead_id },
// //       data: {
// //         status: "Converted",
// //         converted_at: new Date()
// //       }
// //     });

// //     // 7️⃣ Timeline log
// //     await addTimelineEvent(
// //       lead.lead_id,
// //       "LEAD_CONVERTED",
// //       `Lead converted → Account:${account.account_id}, Deal:${deal.deal_id}`,
// //       user.userId
// //     );

// //     return { account, contact, deal };
// //   });
// // }

// // module.exports = { convertLead };
// const prisma = require("../../database/prisma");
// const { addTimelineEvent } = require("./lead.timeline");

// async function convertLead(leadId, user, dealInput) {
//   return prisma.$transaction(async (tx) => {

//     // 1️⃣ Get Lead
//     const lead = await tx.lead.findFirst({
//       where: {
//         lead_id: leadId,
//         company_id: user.company_id
//       }
//     });

//     if (!lead) throw new Error("Lead not found");

//     // 2️⃣ Mandatory Business Rules
//     if (!lead.budget || !lead.expectedClose || !lead.assigned_to) {
//       throw new Error("Budget, Expected Close Date, and Owner are required");
//     }

//     if (lead.lead_status === "Converted") {
//       throw new Error("Lead already converted");
//     }

//     // 3️⃣ Create Account
//     const account = await tx.account.create({
//       data: {
//         company_name: lead.company_name || `${lead.first_name || ""} ${lead.last_name || ""}`.trim(),
//         company_id: user.company_id,
//         branch_id: user.branch_id
//       }
//     });

//     // 4️⃣ Create Contact
//     const contact = await tx.contact.create({
//       data: {
//         first_name: lead.first_name || "Unknown",
//         last_name: lead.last_name || "",
//         email: lead.email,
//         phone: lead.phone,
//         lead_id: lead.lead_id,
//         company_id: user.company_id,
//         branch_id: user.branch_id
//       }
//     });

//     // 5️⃣ Create Deal (MANDATORY)
// const deal = await tx.deal.create({
//   data: {
//     title: dealInput.title || `Deal for ${lead.first_name || "Lead"}`,
//     amount: dealInput.amount || lead.budget,
//     stage: "Qualification",
//     probability: 10,
//     lead_id: lead.lead_id,
//     account_id: account.account_id,
//     contact_id: contact.contact_id,
//     company_id: user.company_id,
//     branch_id: user.branch_id,
//     owner_id: lead.assigned_to,
//     status: "Open"
//   }
// });

//     // 6️⃣ Update Lead Status
//     await tx.lead.update({
//       where: { lead_id: lead.lead_id },
//       data: {
//         lead_status: "Converted",
//         updated_at: new Date()
//       }
//     });

//     // 7️⃣ Timeline Log
//     await addTimelineEvent(
//       lead.lead_id,
//       "LEAD_CONVERTED",
//       `Lead converted → Account:${account.account_id}, Deal:${deal.deal_id}`
//     );

//     return { account, contact, deal };
//   });
// }

// module.exports = { convertLead };


const prisma = require("../../database/prisma");
const { addTimelineEvent } = require("./lead.timeline");

async function convertLead(leadId, user, dealInput) {
  return prisma.$transaction(async (tx) => {

    // 1️⃣ Fetch Lead
    const lead = await tx.lead.findFirst({
      where: {
        lead_id: leadId,
        company_id: user.company_id
      }
    });

    if (!lead) throw new Error("Lead not found");

    // 2️⃣ Business Rules
    if (!lead.budget || !lead.expectedClose || !lead.assigned_to) {
      throw new Error("Budget, Expected Close Date, and Owner are required");
    }

    if (lead.lead_status === "Converted") {
      throw new Error("Lead already converted");
    }

    // 3️⃣ Create Account
    const account = await tx.account.create({
      data: {
        company_name:
          lead.company_name ||
          `${lead.first_name || ""} ${lead.last_name || ""}`.trim(),
        company_id: user.company_id,
        branch_id: user.branch_id
      }
    });

    // 4️⃣ Create Contact
    const contact = await tx.contact.create({
      data: {
        first_name: lead.first_name || "Unknown",
        last_name: lead.last_name || "",
        email: lead.email,
        phone: lead.phone,
        lead_id: lead.lead_id,
        account_id: account.account_id, // ✅ IMPORTANT
        company_id: user.company_id,
        branch_id: user.branch_id
      }
    });

    // 5️⃣ Create Deal
    const deal = await tx.deal.create({
      data: {
        name: dealInput.name || `Deal for ${lead.first_name || "Lead"}`, // ✅ name
        amount: dealInput.amount || lead.budget,
        stage: "Qualification",
        probability: 10,
        expected_close_date: lead.expectedClose,

        lead_id: lead.lead_id,
        account_id: account.account_id,
        contact_id: contact.contact_id,

        company_id: user.company_id,
        branch_id: user.branch_id,
        status: "Open"
      }
    });

    // 6️⃣ Update Lead
    await tx.lead.update({
      where: { lead_id: lead.lead_id },
      data: {
        lead_status: "Converted"
      }
    });

    // 7️⃣ Timeline
    await addTimelineEvent(
      lead.lead_id,
      "LEAD_CONVERTED",
      `Lead converted → Account:${account.account_id}, Deal:${deal.deal_id}`
    );

    return { account, contact, deal };
  });
}

module.exports = { convertLead };
