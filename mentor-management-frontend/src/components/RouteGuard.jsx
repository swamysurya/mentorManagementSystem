import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

export const RouteGuard = ({ children, allowedRole, requireAuth = true }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Public route and user is authenticated - redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    const redirectPath = user.role === 'RP' ? '/admin' : '/mentor';
    return <Navigate to={redirectPath} replace />;
  }

  // Protected route and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Protected route and wrong role
  if (requireAuth && allowedRole && user?.role !== allowedRole) {
    const redirectPath = user.role === 'RP' ? '/admin' : '/mentor';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

RouteGuard.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRole: PropTypes.string,
  requireAuth: PropTypes.bool,
};