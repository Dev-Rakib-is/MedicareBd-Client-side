import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contex/AuthContex";

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();
  const { loading, user } = useAuth();
  if (loading) {
    return <p className="text-black dark:text-white">Loading</p>;
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={"/unauthorized"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
