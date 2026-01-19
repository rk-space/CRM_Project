// Strict enterprise pipeline flow
const PIPELINE = {
  Prospecting: ["Qualification"],   
  Qualification: ["Proposal"],
  Proposal: ["Negotiation"],
  Negotiation: ["Won", "Lost"],
  Won: [],
  Lost: []
};

const STAGE_PROBABILITY = {
  Prospecting: 5,     
  Qualification: 10,
  Proposal: 40,
  Negotiation: 70,
  Won: 100,
  Lost: 0
};

function validateStage(current, next) {
  return PIPELINE[current]?.includes(next);
}

module.exports = {
  PIPELINE,
  STAGE_PROBABILITY,
  validateStage
};
