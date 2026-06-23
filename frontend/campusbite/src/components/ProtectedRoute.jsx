import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  user,
  role,
  loading,
}) {
  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const actualRole = user?.user?.role || user?.role;

  if (role && actualRole?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
