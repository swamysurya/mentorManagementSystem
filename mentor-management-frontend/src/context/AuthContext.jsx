import { createContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      return token && role ? { token, role } : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  });

  const login = useCallback((token, role) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      setUser({ token, role });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to login');
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUser(null);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      throw new Error('Failed to logout');
    }
  }, []);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};