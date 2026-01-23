import { createContext, useContext } from 'react';
import { PERMISSIONS } from '../../utils/constants';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  // TEMP: Mock user permissions
  // In production, this would come from authentication/backend
  const userPermissions = [
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_EDIT,
    PERMISSIONS.LEADS_DELETE,
    PERMISSIONS.LEADS_ASSIGN,
    PERMISSIONS.LEADS_CHANGE_STATUS,
    PERMISSIONS.DASHBOARD_VIEW,
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

  const value = {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissionsContext must be used within PermissionsProvider');
  }
  return context;
};
