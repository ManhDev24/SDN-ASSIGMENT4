import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
