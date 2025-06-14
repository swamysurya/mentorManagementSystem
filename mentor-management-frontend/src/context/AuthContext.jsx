import { createContext, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const firstName = Cookies.get("firstName");
      const lastName = Cookies.get("lastName");
      return token && role ? { token, role, firstName, lastName } : null;
    } catch (error) {
      console.error("Error reading from cookies:", error);
      return null;
    }
  });

  const login = useCallback((token, role, firstName, lastName) => {
    try {
      // Set cookies with secure options
      Cookies.set("token", token, {
        expires: 1, // 1 day
        secure: true, // Only sent over HTTPS
        sameSite: "strict", // CSRF protection
        path: "/", // Available across the site
      });

      Cookies.set("role", role, {
        expires: 1,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      Cookies.set("firstName", firstName, {
        expires: 1,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      Cookies.set("lastName", lastName, {
        expires: 1,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      setUser({ token, role, firstName, lastName });
    } catch (error) {
      console.error("Error saving to cookies:", error);
      throw new Error("Failed to login");
    }
  }, []);

  const logout = useCallback(() => {
    try {
      // Remove cookies
      Cookies.remove("token", { path: "/" });
      Cookies.remove("role", { path: "/" });
      Cookies.remove("firstName", { path: "/" });
      Cookies.remove("lastName", { path: "/" });
      setUser(null);
    } catch (error) {
      console.error("Error removing cookies:", error);
      throw new Error("Failed to logout");
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
