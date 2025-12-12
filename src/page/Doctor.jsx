import { useAuth } from '../contex/AuthContex'
import Login from './Login'
import { Outlet } from 'react-router'


const Doctor = () => {
 const {user}=useAuth()
 if(!user)return <Login/>
 
     if(user.role === "DOCTOR" || user.role === "PATiENT"){ return <Outlet/>}
     

     return <div className="mt-16 text-red-600">Unauthorized</div>
}


export default Doctor