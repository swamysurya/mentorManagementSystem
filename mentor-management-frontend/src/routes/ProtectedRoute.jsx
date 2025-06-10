// src/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRole }) {
  const { token, role } = useAuth();

  if (!token || role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRole: PropTypes.string.isRequired,
};
