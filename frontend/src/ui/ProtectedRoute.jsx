import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading, authChecked } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (!authChecked || loading) {
    return <Loader />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated and trying to access root, redirect to dashboard
  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated and valid route - render children
  return children;
};

export default ProtectedRoute;
