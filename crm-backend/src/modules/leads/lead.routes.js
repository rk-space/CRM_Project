const express = require("express");
const router = express.Router();

const leadController = require("./lead.controller");

// Create Lead
router.post("/", leadController.createLead);

// Get all leads (filters + pagination)
router.get("/", leadController.getLeads);

// Get single lead with timeline
router.get("/:id", leadController.getLeadById);

// Update lead (general fields)
router.put("/:id", leadController.updateLead);

// 🔹 Assign / Reassign Lead
router.patch("/:id/assign", leadController.assignLead);

// 🔹 Update lead status (AUTO SCORING + TIMELINE)
router.patch("/:id/status", leadController.updateLeadStatus);

// Delete lead
router.delete("/:id", leadController.deleteLead);

module.exports = router;
