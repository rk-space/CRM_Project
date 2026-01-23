// Centralized permission hook
// In production, this would fetch from context/store
export const usePermissions = () => {
  // TEMP: Mock permissions (will be replaced with actual auth context)
  const userPermissions = [
    'leads.view',
    'leads.create',
    'leads.edit',
    'leads.delete',
    'leads.assign',
    'leads.changeStatus',
    'dashboard.view',
  ];

  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some((p) => userPermissions.includes(p));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every((p) => userPermissions.includes(p));
  };

  return { hasPermission, hasAnyPermission, hasAllPermissions };
};
