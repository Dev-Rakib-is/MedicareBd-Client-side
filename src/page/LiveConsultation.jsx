import { useAuth } from "../contex/AuthContex";
import { useParams } from "react-router";
import Login from "./Login";
import PatientLiveConsaltation from "../components/consultations/PatientLiveConsaltation";
import DoctorLiveConsaltation from "../components/consultations/DoctorLiveConsaltation";

const LiveConsultations = () => {
  const { user } = useAuth();
  const { roomId } = useParams();

  if (!user) return <Login />;

  switch (user.role) {
    case "DOCTOR":
      return (
        <DoctorLiveConsaltation appointmentId={roomId} doctorName={user.name} />
      );

    case "PATIENT":
      return (
        <PatientLiveConsaltation appointmentId={roomId} doctorName="Doctor" />
      );

    default:
      return <div className="mt-16">Unauthorized</div>;
  }
};

export default LiveConsultations;
