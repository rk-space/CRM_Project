// const express = require("express");
// const router = express.Router();

// const leadController = require("./lead.controller");

// // Middleware
// const authMiddleware = require("../../middleware/auth.middleware");
// const rbac = require("../../middleware/rbac.middleware");

// /*
// |--------------------------------------------------------------------------
// | LEADS ROUTES (Enterprise RBAC Protected)
// |--------------------------------------------------------------------------
// | All routes below:
// | - Require Authentication
// | - Enforce Permission-Based Access Control
// | - Are Tenant-Aware via req.user context
// |--------------------------------------------------------------------------
// */

// // -------------------------
// // CONVERT LEAD → CONTACT (Sprint 2)
// // Must be before any "/:id" routes
// // -------------------------
// // CONVERT LEAD → ACCOUNT / CONTACT
// router.post(
//   "/:id/convert",
//   authMiddleware,
//   rbac("LEADS_CONVERT"),
//   leadController.convert
// );
// // router.post(
// //   "/:id/convert",
// //   authMiddleware,
// //   rbac("LEADS_CONVERT"),
// //   leadController.convertLead
// // ); 
// // CREATE LEAD
// // -------------------------
// router.post(
//   "/",
//   authMiddleware,
//   rbac(["LEADS_CREATE", "LEADS_WRITE"]),
//   leadController.createLead
// );

// // -------------------------
// // GET ALL LEADS
// // -------------------------
// router.get(
//   "/",
//   authMiddleware,
//   rbac(["LEADS_READ"]),
//   leadController.getLeads
// );

// // -------------------------
// // GET SINGLE LEAD
// // -------------------------
// router.get(
//   "/:id",
//   authMiddleware,
//   rbac(["LEADS_READ"]),
//   leadController.getLeadById
// );

// // -------------------------
// // UPDATE LEAD
// // -------------------------
// router.put(
//   "/:id",
//   authMiddleware,
//   rbac(["LEADS_UPDATE", "LEADS_WRITE"]),
//   leadController.updateLead
// );

// // -------------------------
// // ASSIGN / REASSIGN LEAD
// // -------------------------
// router.patch(
//   "/:id/assign",
//   authMiddleware,
//   rbac(["LEADS_ASSIGN"]),
//   leadController.assignLead
// );

// // -------------------------
// // UPDATE LEAD STATUS
// // -------------------------
// router.patch(
//   "/:id/status",
//   authMiddleware,
//   rbac(["LEADS_UPDATE"]),
//   leadController.updateLeadStatus
// );

// // -------------------------
// // DELETE LEAD
// // -------------------------
// router.delete(
//   "/:id",
//   authMiddleware,
//   rbac(["LEADS_DELETE"]),
//   leadController.deleteLead
// );

// module.exports = router;


const express = require("express");
const router = express.Router();

const leadController = require("./lead.controller");

// Middleware
const authMiddleware = require("../../middleware/auth.middleware");
const rbac = require("../../middleware/rbac.middleware");

// 🔹 Mount Deals Routes inside Leads (No index.js change needed)
const dealRoutes = require("../deals/deal.routes");

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
// CONVERT LEAD → ACCOUNT / CONTACT / DEAL
// -------------------------
router.post(
  "/:id/convert",
  authMiddleware,
  rbac("LEADS_CONVERT"),
  leadController.convert
);

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

// -------------------------
// DEALS ROUTES (Mounted Here)
// -------------------------
// Access like:
// /api/leads/deals
// /api/leads/deals/:id/stage
router.use("/deals", dealRoutes);

module.exports = router;
