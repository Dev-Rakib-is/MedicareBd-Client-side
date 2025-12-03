import AdminPayroll from "../components/payroll/AdminPayroll";
import DoctorPayroll from "../components/payroll/DoctorPayroll";
import { useAuth } from "../contex/AuthContex"
import Login from "./Login";


const Payroll = () => {
    const {user} =useAuth();
    if(!user) return <Login/>
    switch (user.role) {
        case "ADMIN": return <AdminPayroll/>;
        case "DOCTOR":return <DoctorPayroll/>;
    
        default: return <div className="mt-16 text-red-600">Unauthorized</div>
    }
}

export default Payroll