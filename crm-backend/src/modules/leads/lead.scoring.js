// lead.scoring.js

exports.calculateLeadScore = (lead) => {
  let score = 0;

  switch (lead.lead_status) {
    case "New":
      score = 0;
      break;
    case "Contacted":
      score = 10;
      break;
    case "Qualified":
      score = 20;
      break;
    case "Converted":
      score = 50;
      break;
    default:
      score = 0;
  }

  // Optional: add more scoring based on campaign, tags, industry, etc.
  return score;
};
// Lead status scoring rules
const STATUS_SCORE_MAP = {
  Contacted: 5,
  Qualified: 10,
  Converted: 20,
  Unqualified: -10,
};

exports.getScoreDelta = (newStatus) => {
  return STATUS_SCORE_MAP[newStatus] || 0;
};
