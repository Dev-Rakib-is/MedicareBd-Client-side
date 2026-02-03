import { useAuth } from "../contex/AuthContex";
import Login from "./Login";
import { Outlet } from "react-router";

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) return <Login />;

  switch (user.role) {
    case "ADMIN":
      return <Outlet />;

    case "DOCTOR":
    case "PATIENT":
      return <Outlet />;

    default:
      return (
        <div className="mt-16 text-red-600 font-semibold text-center">
          Unauthorized
        </div>
      );
  }
};

export default ProtectedRoute;
