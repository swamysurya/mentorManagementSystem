import { useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const handleLogin = useCallback(
    async (token, role, firstName, lastName) => {
      context.login(token, role, firstName, lastName);
      const from = location.state?.from?.pathname;
      const defaultPath =
        role === "RP" ? "/admin" : role === "CDS" ? "/cds" : "/mentor";
      navigate(from || defaultPath, { replace: true });
    },
    [context.login, navigate, location]
  );

  const handleLogout = useCallback(() => {
    context.logout();
    navigate("/login", { replace: true });
  }, [context.logout, navigate]);

  return {
    ...context,
    handleLogin,
    handleLogout,
  };
};
