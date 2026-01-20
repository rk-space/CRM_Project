const dealService = require("./deal.service");

/**
 * CREATE DEAL
 */
exports.createDeal = async (req, res) => {
  try {
    const deal = await dealService.createDeal(req.body, req.user);
    res.status(201).json({ success: true, data: deal });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * GET ALL DEALS
 */
exports.getDeals = async (req, res) => {
  try {
    const deals = await dealService.getDeals(req.query, req.user);
    res.json({ success: true, data: deals });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE DEAL STAGE
 */
exports.updateDealStage = async (req, res) => {
  try {
    const deal = await dealService.updateDealStage(
      req.params.id,
      req.body.stage,
      req.user
    );
    res.json({ success: true, data: deal });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
