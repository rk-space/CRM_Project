require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

// ✅ Correct middleware imports
const dealRoutes = require("./modules/deals/deal.routes");
const authMiddleware = require("./middleware/auth.middleware");
const leadRoutes = require("./modules/leads/lead.routes");

const contactRoutes = require("./modules/contacts/contact.routes");


const app = express();

/* ============================
   CORE MIDDLEWARE
============================ */
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

/* ============================
   TEMP DEV AUTH USER (DEV ONLY)
   → This is optional, can be removed once JWT is fully implemented
============================ */

/* ============================
   ROUTES
============================ */
app.get("/", (req, res) => {
  res.json({ message: "CRM Backend Running..." });
});

// ✅ Apply auth middleware for all /api routes if needed
app.use("/api/leads", authMiddleware, leadRoutes);

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

/* ============================
   SERVER START
============================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CRM Backend running on port ${PORT}`);
});

app.use("/api/deals", authMiddleware, dealRoutes);



app.use("/api/contacts", contactRoutes);