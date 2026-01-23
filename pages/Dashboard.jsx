import PermissionWrapper from "../app/permissions/PermissionWrapper";
import ProtectedLayout from "../app/layout/ProtectedLayout";

const Dashboard = () => {
  return (
    <ProtectedLayout permission="dashboard.view">
      <h1>Dashboard Page</h1>

      <PermissionWrapper permission="leads.create">
        <button>Create Lead</button>
      </PermissionWrapper>
    </ProtectedLayout>
  );
};

export default Dashboard;
