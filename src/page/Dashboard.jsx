import { useAuth } from "../contex/AuthContex";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import DoctorDashboard from "../components/dashboard//DoctorDashboard";
import AdminDashboard from "../components/dashboard//AdminDashboard";
import Login from "./Login";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Login/>;

  switch (user.role) {
    case "PATIENT":
      return <PatientDashboard />;

    case "DOCTOR":
      return <DoctorDashboard />;

    case "ADMIN":
      return <AdminDashboard />;

    default:
      return <div className="mt-16">Unauthorized</div>;
  }
};

export default Dashboard;
