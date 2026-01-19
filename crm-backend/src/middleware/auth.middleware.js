const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    // -------------------------
    // DEV MODE (for testing)
    // -------------------------
    if (authHeader === "Bearer dev-token") {
      req.user = {
        userId: "dev-user",
        companyId: "company-1",    
        company_id: "company-1",  
        branchId: "branch-1",      
        branch_id: "branch-1",     
        role: "ADMIN",
        scope: "company",
        permissions: [
          "LEADS_READ",
          "LEADS_WRITE",
          "LEADS_ASSIGN",
          "LEADS_CONVERT",
          "LEADS_UPDATE"           
        ],
      };
      return next();
    }

    // -------------------------
    // PRODUCTION MODE (JWT)
    // -------------------------
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      companyId: decoded.companyId,
      branchId: decoded.branchId,
      role: decoded.role,
      scope: decoded.scope,
      permissions: decoded.permissions || [],
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
