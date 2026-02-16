import AdminAppointments from "../components/appointment/AdminAppointment";
import DoctorSideAppointment from "../components/appointment/DoctorSideAppointment";
import PatientSideAppointment from "../components/appointment/PatientSideAppointment";
import { useAuth } from "../contex/AuthContex";
import Login from "./Login";

const Appointment = () => {
  const { user } = useAuth();
  if (!user) return <Login />;
  switch (user.role) {
    case "PATIENT":
      return <PatientSideAppointment />;
    case "ADMIN":
      return <AdminAppointments />;
    case "DOCTOR":
      return <DoctorSideAppointment />;
    default:
      return <div className="mt-16 text-red-600">Unauthorized</div>;
  }
};

export default Appointment;
