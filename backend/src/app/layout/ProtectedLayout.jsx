const ProtectedLayout = ({ permission, children }) => {

  // TEMP user permissions
  const userPermissions = [
    "dashboard.view",
    "leads.view",
  ];

  if (!userPermissions.includes(permission)) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;
