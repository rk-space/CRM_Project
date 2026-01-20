// const router = require("express").Router();
// const ctrl = require("./deal.controller");
// const auth = require("../auth/auth.middleware");
// const rbac = require("../auth/rbac.middleware");

// router.post("/", auth, rbac("DEALS_WRITE"), ctrl.createDeal);
// router.get("/", auth, rbac("DEALS_READ"), ctrl.getDeals);
// router.patch("/:id/stage", auth, rbac("DEALS_UPDATE_STAGE"), ctrl.updateDealStage);

// module.exports = router;

const express = require("express");
const router = express.Router();

const dealController = require("./deal.controller");

// Use SAME middleware path style as leads
const authMiddleware = require("../../middleware/auth.middleware");
const rbac = require("../../middleware/rbac.middleware");

/*
|--------------------------------------------------------------------------
| DEALS ROUTES (Sales Pipeline Engine)
|--------------------------------------------------------------------------
| - Auth Protected
| - RBAC Enforced
| - Tenant Aware
|--------------------------------------------------------------------------
*/

// -------------------------
// CREATE DEAL (Manual Creation)
// -------------------------
router.post(
  "/",
  authMiddleware,
  rbac(["LEADS_WRITE"]),
  dealController.createDeal
);

// -------------------------
// GET ALL DEALS
// -------------------------
router.get(
  "/",
  authMiddleware,
  rbac(["LEADS_READ"]),
  dealController.getDeals
);

// -------------------------
// UPDATE DEAL STAGE (Pipeline Control)
// -------------------------
router.patch(
  "/:id/stage",
  authMiddleware,
  rbac(["LEADS_WRITE"]),
  dealController.updateDealStage
);

module.exports = router;
