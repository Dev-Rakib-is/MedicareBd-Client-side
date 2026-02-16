import DoctorsideNotification from "../components/notifications/DoctorSideNotification";
import { useAuth } from "../contex/AuthContex";
import Login from "./Login";
import AdminSideNotification from "../components/notifications/AdminSideNotification";
import PatientSideNotification from "../components/notifications/PatientSideNotification";

const Appointment = () => {
  const { user } = useAuth();
  if (!user) return <Login />;
  switch (user.role) {
    case "PATIENT":
      return <PatientSideNotification />;
    case "ADMIN":
      return <AdminSideNotification />;
    case "DOCTOR":
      return <DoctorsideNotification />;
    default:
      return <div className="mt-16 text-red-600">Unauthorized</div>;
  }
};

export default Appointment;
