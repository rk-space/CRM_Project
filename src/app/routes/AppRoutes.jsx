import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProtectedLayout from "../layout/ProtectedLayout";
import Dashboard from "../../pages/Dashboard";
import LeadsList from "../../pages/leads/LeadsList";
import LeadCreate from "../../pages/leads/LeadCreate";
import LeadEdit from "../../pages/leads/LeadEdit";
import LeadDetails from "../../pages/leads/LeadDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/leads" replace />} />

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
          <MainLayout>
            <LeadsList />
          </MainLayout>
        }
      />

      <Route
        path="/leads/create"
        element={
          <MainLayout>
            <LeadCreate />
          </MainLayout>
        }
      />

      <Route
        path="/leads/:id"
        element={
          <MainLayout>
            <LeadDetails />
          </MainLayout>
        }
      />

      <Route
        path="/leads/:id/edit"
        element={
          <MainLayout>
            <LeadEdit />
          </MainLayout>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
