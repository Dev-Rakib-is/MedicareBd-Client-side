import { useAuth } from "../contex/AuthContex";
import Login from "./Login";
import PatientLiveConsaltation from './../components/consultations/PatientLiveConsaltation';
import DoctorLiveConsaltation from "../components/consultations/DoctorLiveConsaltation";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Login/>;

  switch (user.role) {
    case "DOCTOR":
      return <DoctorLiveConsaltation />;

    case "PATIENT":
      return <PatientLiveConsaltation/>;

    default:
      return <div className="mt-16">Unauthorized</div>;
  }
};

export default Dashboard;
