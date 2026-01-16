module.exports = (requiredPermissions = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: user context missing",
        });
      }

      const {
        permissions = [],
        role,
        scope,
        userId,
        companyId,
      } = req.user;

      // -------------------------
      // SUPER ADMIN / DEV MODE
      // -------------------------
      if (
        permissions.includes("*") ||
        role === "SUPER_ADMIN"
      ) {
        return next();
      }

      // Normalize required permissions
      const required = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      // -------------------------
      // PERMISSION CHECK
      // -------------------------
      const hasPermission = required.some((perm) =>
        permissions.includes(perm)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions",
          meta: {
            required,
            granted: permissions,
            role,
            scope,
            user: userId,
            company: companyId,
          },
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "RBAC middleware error",
      });
    }
  };
};
