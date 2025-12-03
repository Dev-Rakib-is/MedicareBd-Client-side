import DoctorAppointment from "../components/appointment/DoctorAppointment"
import PatientAppointment from "../components/appointment/PatientAppointment"
import { useAuth } from "../contex/AuthContex"
import Login from "./Login"






const Appointment = () => {
  const {user}=useAuth()
  if (!user) return <Login/>
      switch (user.role) {
      case "PATIENT":
        return <PatientAppointment/>;
        case "DOCTOR": return <DoctorAppointment/>
      default:
      return <div className="mt-16 text-red-600">Unauthorized</div>
    }
 
}

export default Appointment