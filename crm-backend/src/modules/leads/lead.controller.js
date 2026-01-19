const leadService = require("./lead.service");
const { convertLead } = require("./lead.conversion")

exports.createLead = async (req, res) => {
  try {
    const lead = await leadService.createLead(req.body, req.user);
    return res.status(201).json({ success: true, data: lead });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const result = await leadService.getLeads(req.query, req.user);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await leadService.getLeadById(req.params.id, req.user);
    return res.json({ success: true, data: lead });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await leadService.updateLead(
      req.params.id,
      req.body,
      req.user
    );
    return res.json({ success: true, data: lead });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    await leadService.deleteLead(req.params.id, req.user);
    return res.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
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

    return res.json({ success: true, data: lead });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

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

    return res.json({ success: true, data: lead });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};




exports.convert = async (req, res) => {
  try {
    const result = await convertLead(
      req.params.id,
      req.user,
      req.body
    );

    return res.json({
      success: true,
      message: "Lead converted successfully",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};