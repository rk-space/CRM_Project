const leadService = require("./lead.service");

exports.createLead = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body, req.user);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const result = await leadService.getLeads(req.query, req.user);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id, req.user);
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body, req.user);
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id, req.user);
    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
exports.assignLead = async (req, res) => {
  try {
    const { assigned_to } = req.body;

    if (!assigned_to) {
      return res.status(400).json({
        success: false,
        message: "assigned_to user id is required",
      });
    }

    const lead = await leadService.assignLead(
      req.params.id,
      assigned_to,
      req.user
    );

    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


// 🔹 Update Lead Status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { lead_status } = req.body;

    if (!lead_status) {
      return res.status(400).json({
        success: false,
        message: "lead_status is required",
      });
    }

    const lead = await leadService.updateLeadStatus(
      req.params.id,
      lead_status,
      req.user
    );

    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
