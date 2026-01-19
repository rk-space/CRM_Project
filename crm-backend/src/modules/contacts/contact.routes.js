const express = require("express");
const router = express.Router();

const controller = require("./contact.controller");
const auth = require("../../middleware/auth.middleware");
const rbac = require("../../middleware/rbac.middleware");

// Convert Lead → Contact
router.post(
  "/convert/:leadId",
  auth,
  rbac(["LEADS_CONVERT"]),
  controller.convertLead
);

module.exports = router;
