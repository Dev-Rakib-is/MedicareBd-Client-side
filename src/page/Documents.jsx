import DoctorDocuments from "../components/document/DoctorDocuments"
import PatientDocuments from "../components/document/Patientdocuments"
import { useAuth } from "../contex/AuthContex"
import Login from "./Login"



const Documents = () => {
    
    const {user} = useAuth();
    if (!user) return <Login/>;
    
    switch (user.role) {
        case "PATIENT": return <PatientDocuments/>;
        case "DOCTOR": return <DoctorDocuments/>    
        default:
    
  return  <div>Unauthorized</div>
    }
}

export default Documents