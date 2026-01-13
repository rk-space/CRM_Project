import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProtectedLayout from "../layout/ProtectedLayout";
import Dashboard from "../../pages/Dashboard";
import Leads from "../../pages/Leads";

const AppRoutes = () => {
  return (
    <Routes>

      <Route
        path="/dashboard"
        element={
          <ProtectedLayout permission="dashboard.view">
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedLayout>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedLayout permission="leads.view">
            <MainLayout>
              <Leads />
            </MainLayout>
          </ProtectedLayout>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
