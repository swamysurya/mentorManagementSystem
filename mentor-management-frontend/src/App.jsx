import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RouteGuard } from './components/RouteGuard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import DoubtsTracker from './pages/DoubtsTracker';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <RouteGuard requireAuth={false}>
              <Login />
            </RouteGuard>
          } />

          {/* Protected Routes */}
          <Route path="/admin" element={
            <RouteGuard allowedRole="RP">
              <AdminDashboard />
            </RouteGuard>
          } />

          <Route path="/mentor" element={
            <RouteGuard allowedRole="mentor">
              <MentorDashboard />
            </RouteGuard>
          } />

          <Route path="/doubts" element={
            <RouteGuard allowedRole="mentor">
              <DoubtsTracker />
            </RouteGuard>
          } />

          {/* Root Redirect */}
          <Route path="/" element={
            <RouteGuard requireAuth={false}>
              <Navigate to="/login" replace />
            </RouteGuard>
          } />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;