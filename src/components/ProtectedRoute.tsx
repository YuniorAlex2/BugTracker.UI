import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = isAuthenticated();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
