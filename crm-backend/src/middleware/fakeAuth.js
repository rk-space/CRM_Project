module.exports = (req, res, next) => {
  req.user = {
    id: "user-123",
    company_id: "company-1",
    branch_id: "branch-1",
    role: "admin",
    scope: "company",
  };
  next();
};
