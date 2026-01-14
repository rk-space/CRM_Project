const PermissionWrapper = ({ permission, children }) => {

  // TEMP permissions (later comes from backend)
  const userPermissions = [
    "leads.view",
    "leads.create",
    "leads.edit",
    "leads.delete",
    "leads.assign",
    "leads.changeStatus",
    "dashboard.view",
  ];

  // Check permission
  if (!userPermissions.includes(permission)) {
    return null; // hide component
  }

  return <>{children}</>;
};

export default PermissionWrapper;
