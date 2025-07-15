import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RouteGuard } from "./components/common/RouteGuard";
import Login from "./pages/common/Login";
import AdminDashboard from "./pages/roles/rp/AdminDashboard";
import MentorDashboard from "./pages/roles/mentor/MentorDashboard";
import CDSDashboard from "./pages/roles/cds/CDSDashboard";
import AllIssuesPage from "./pages/roles/cds/AllIssuesPage";
import SchedulePage from "./pages/roles/mentor/SchedulePage";
import DoubtsPage from "./pages/roles/mentor/DoubtsPage";
import FeedbackPage from "./pages/roles/mentor/FeedbackPage";
import NotFound from "./pages/common/NotFound";
import IssuesPage from "./pages/roles/mentor/IssuesPage";
import IssueDetail from "./pages/roles/mentor/IssueDetail";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <RouteGuard requireAuth={false}>
                <Login />
              </RouteGuard>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <RouteGuard allowedRole="RP">
                <AdminDashboard />
              </RouteGuard>
            }
          />

          <Route
            path="/mentor"
            element={
              <RouteGuard allowedRole="mentor">
                <MentorDashboard />
              </RouteGuard>
            }
          />

          <Route
            path="/cds"
            element={
              <RouteGuard allowedRole="CDS">
                <CDSDashboard />
              </RouteGuard>
            }
          />

          <Route
            path="/all-issues"
            element={
              <RouteGuard allowedRole="CDS">
                <AllIssuesPage />
              </RouteGuard>
            }
          />

          <Route
            path="/schedule"
            element={
              <RouteGuard allowedRole="mentor">
                <SchedulePage />
              </RouteGuard>
            }
          />

          <Route
            path="/doubts"
            element={
              <RouteGuard allowedRole="mentor">
                <DoubtsPage />
              </RouteGuard>
            }
          />

          <Route
            path="/feedback"
            element={
              <RouteGuard allowedRole="mentor">
                <FeedbackPage />
              </RouteGuard>
            }
          />

          <Route
            path="/issues"
            element={
              <RouteGuard allowedRole="mentor">
                <IssuesPage />
              </RouteGuard>
            }
          />

          <Route
            path="/issues/:id"
            element={
              <RouteGuard allowedRole="mentor">
                <IssueDetail />
              </RouteGuard>
            }
          />

          {/* Root Redirect */}
          <Route
            path="/"
            element={
              <RouteGuard requireAuth={false}>
                <Navigate to="/login" replace />
              </RouteGuard>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
