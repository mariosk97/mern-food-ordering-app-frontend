import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setShouldRender(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (isLoading || !shouldRender) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>;
  }

  if (isAuthenticated) return <Outlet />;

  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
