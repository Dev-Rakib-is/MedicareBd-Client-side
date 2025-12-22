import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import Unauthorized from "./page/Unauthorized";
import Home from "./page/Home";
import RootLayouts from "./layoouts/RootLayouts";
import Login from "./page/Login";
import Registration from "./page/Registration";
import BookAppointment from "./page/BookAppointment";
import DoctorDetails from "./page/DoctorDetails";
import SettingsLayout from "./layoouts/SettingsLayout";
import AccountSettings from "./page/AccountSettings";
import PreferenceSettings from "./page/PreferenceSettings";
import NotificationSettings from "./page/NotificationSettings";
import SecuritySettings from "./page/SecuritySettings";
import Notification from "./page/Notification";
import Dashboard from "./page/Dashboard";
import Appointment from "./page/Appointment";
import BillsPage from "./page/Bill";
import Documents from "./page/Documents";
import LiveConsultation from "./page/LiveConsultations";
import NoticeBoard from "./page/NoticeBoard";
import Invoice from "./page/Incoice";
import Payroll from "./page/Payroll";
import PatientsPage from "./page/PatientsPage";
import PatientCases from "./page/PatientCases";
import Prescriptions from "./page/Prescriptions";

import Reports from "./page/Reports";

import AdminLogin from "./page/AdminLogin";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import AdminUsers from "./page/AdminUsers";

// Doctor Protect Component
import AdminDoctors from "./components/doctor/AdminDoctors";
import PatientDoctor from "./components/doctor/PatientDoctor";
import AdminDepartments from "./page/AdminDepartments";
import TermsPage from "./page/TermsPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./contex/AuthContex";
import { useFontSize } from "./contex/FontContext";
import PrivacyPolicy from "./page/PrivacyPolicy";
import CookiePolicy from "./page/CookiePolicy";
import Disclaimer from "./page/Disclaimer";

function App() {
  const { user } = useAuth();
  const { fontSize, fontSizeClass } = useFontSize();

  return (
    <div className={`${fontSizeClass[fontSize]}`}>
      <Routes>
        <Route element={<RootLayouts />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/users" element={<AdminUsers />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />

          <Route path="/doctor-details" element={<DoctorDetails />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route
            path="/book-appointment/:doctorId"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          <Route path="/notifications" element={<Notification />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/notice" element={<NoticeBoard />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/consultations" element={<LiveConsultation />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patient-cases" element={<PatientCases />} />
          <Route path="/admin/Departments" element={<AdminDepartments />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          <Route
            path="/prescriptions"
            element={
              user ? (
                <Prescriptions patientId={user._id} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/reports"
            element={
              user ? <Reports patientId={user._id} /> : <Navigate to="/login" />
            }
          />

          {/* Doctor Routes with Guard */}
          <Route path="/admin/doctors">
            <Route index element={<AdminDoctors />} />
            <Route path="patient" element={<PatientDoctor />} />
          </Route>

          {/* Settings Routes */}
          <Route path="setting" element={<SettingsLayout />}>
            <Route path="account" element={<AccountSettings />} />
            <Route path="preferences" element={<PreferenceSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="security" element={<SecuritySettings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
export default App;
