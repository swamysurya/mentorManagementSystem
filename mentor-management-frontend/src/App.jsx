import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RouteGuard } from "./components/RouteGuard";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import SchedulePage from "./pages/SchedulePage";
import DoubtsPage from "./pages/DoubtsPage";
import FeedbackPage from "./pages/FeedbackPage";
import NotFound from "./pages/NotFound";
import IssuesPage from "./pages/IssuesPage";

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
