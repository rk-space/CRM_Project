require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const fakeAuth = require("./middleware/fakeAuth");
const leadRoutes = require("./modules/leads/lead.routes");

const app = express();

/* ============================
   CORE MIDDLEWARE
============================ */
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

/* ============================
   TEMP AUTH USER (DEV ONLY)
   → Will be replaced by JWT
============================ */
app.use((req, res, next) => {
  req.user = {
    id: "system-user",
    company_id: "company-1",
    branch_id: "branch-1",
    roles: ["ADMIN"],
  };
  next();
});

/* ============================
   ROUTES
============================ */
app.get("/", (req, res) => {
  res.json({ message: "CRM Backend Running..." });
});

app.use("/api/leads", leadRoutes);

/* ============================
   GLOBAL ERROR HANDLER
============================ */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});
app.use(fakeAuth); // ⬅️ ADD THIS
/* ============================
   SERVER START
============================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CRM Backend running on port ${PORT}`);
});
