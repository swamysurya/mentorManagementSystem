// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import DoubtsTracker from './pages/DoubtsTracker';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={
            <ProtectedRoute allowedRole="RP">
              <AdminDashboard />
            </ProtectedRoute>
          }/>

          <Route path="/mentor" element={
            <ProtectedRoute allowedRole="mentor">
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

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;