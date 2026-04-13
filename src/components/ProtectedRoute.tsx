import { Navigate } from "react-router-dom";
import { getToken } from "../services/authService";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;