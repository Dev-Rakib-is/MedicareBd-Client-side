import DoctorTerms from "../components/terms/DoctorTerms";
import PatientTerms from "../components/terms/PatientTerms";
import { useAuth } from "../contex/AuthContex";



const TermsPage = ({ role }) => {
  const {user} = useAuth()
  return (
    <div>
      <h1>Terms & Conditions</h1>
      {user.role === "DOCTOR" ? (
        
        <DoctorTerms />
      ) : (
        <PatientTerms />
      )}
    </div>
  );
};

export default TermsPage
