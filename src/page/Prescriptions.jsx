import { useSearchParams } from "react-router-dom";
import { useAuth } from "../contex/AuthContex";
import DoctorSidePrescriptinSide from "../components/prescriptionHelper/DoctorSidePrescriptinSide";
import PatientSidePrescriptions from "../components/prescriptionHelper/PatientSidePrescriptions";
import Unauthorized from "./Unauthorized";

const Prescriptions = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId"); // 👈 IMPORTANT

  if (loading) return <p>Loading Prescription</p>;
  if (!user) return <Unauthorized />;

  return (
    <div>
      {user.role === "DOCTOR" && (
        <DoctorSidePrescriptinSide patientId={patientId} />
      )}

      {user.role === "PATIENT" && <PatientSidePrescriptions />}
    </div>
  );
};

export default Prescriptions;
