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
          <ProtectedLayout permission="leads.view">
            <MainLayout>
              <LeadsList />
            </MainLayout>
          </ProtectedLayout>
        }
      />

      <Route
        path="/leads/create"
        element={
          <ProtectedLayout permission="leads.create">
            <MainLayout>
              <LeadCreate />
            </MainLayout>
          </ProtectedLayout>
        }
      />

      <Route
        path="/leads/:id"
        element={
          <ProtectedLayout permission="leads.view">
            <MainLayout>
              <LeadDetails />
            </MainLayout>
          </ProtectedLayout>
        }
      />

      <Route
        path="/leads/:id/edit"
        element={
          <ProtectedLayout permission="leads.edit">
            <MainLayout>
              <LeadEdit />
            </MainLayout>
          </ProtectedLayout>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
