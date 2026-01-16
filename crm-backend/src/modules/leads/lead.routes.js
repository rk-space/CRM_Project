const express = require("express");
const router = express.Router();

const leadController = require("./lead.controller");

// Middleware
const authMiddleware = require("../../middleware/auth.middleware");
const rbac = require("../../middleware/rbac.middleware");

/*
|--------------------------------------------------------------------------
| LEADS ROUTES (Enterprise RBAC Protected)
|--------------------------------------------------------------------------
| All routes below:
| - Require Authentication
| - Enforce Permission-Based Access Control
| - Are Tenant-Aware via req.user context
|--------------------------------------------------------------------------
*/

// -------------------------
// CREATE LEAD
// -------------------------
router.post(
  "/",
  authMiddleware,
  rbac(["LEADS_CREATE", "LEADS_WRITE"]),
  leadController.createLead
);

// -------------------------
// GET ALL LEADS
// -------------------------
router.get(
  "/",
  authMiddleware,
  rbac(["LEADS_READ"]),
  leadController.getLeads
);

// -------------------------
// GET SINGLE LEAD
// -------------------------
router.get(
  "/:id",
  authMiddleware,
  rbac(["LEADS_READ"]),
  leadController.getLeadById
);

// -------------------------
// UPDATE LEAD
// -------------------------
router.put(
  "/:id",
  authMiddleware,
  rbac(["LEADS_UPDATE", "LEADS_WRITE"]),
  leadController.updateLead
);

// -------------------------
// ASSIGN / REASSIGN LEAD
// -------------------------
router.patch(
  "/:id/assign",
  authMiddleware,
  rbac(["LEADS_ASSIGN"]),
  leadController.assignLead
);

// -------------------------
// UPDATE LEAD STATUS
// -------------------------
router.patch(
  "/:id/status",
  authMiddleware,
  rbac(["LEADS_UPDATE"]),
  leadController.updateLeadStatus
);

// -------------------------
// DELETE LEAD
// -------------------------
router.delete(
  "/:id",
  authMiddleware,
  rbac(["LEADS_DELETE"]),
  leadController.deleteLead
);

module.exports = router;
