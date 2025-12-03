import { motion } from "motion/react";
import { useAuth } from "../contex/AuthContex";
import { Link, NavLink } from "react-router";
import { X } from "lucide-react";

const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  // PUBLIC NAV (no user)
  if (!user) {
    return (
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 90 }}
        className="md:hidden fixed top-0 left-0 bg-gray-200 dark:bg-gray-900 w-64 h-full z-40 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between p-4 border-b border-black/40 dark:border-white/40">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-green-600"
              onClick={onClose}
            >
              Doctor
            </Link>
            <p className="text-xs font-light dark:text-white">Appointment</p>
          </div>

          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
            <X className="dark:text-white" />
          </motion.button>
        </div>

        {/* Public Navigation */}
        <nav className="space-y-3 p-2">
          {["/", "/login", "/registration"].map((path, index) => {
            const labels = ["Home", "Login", "Registration"];
            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive
                    ? "bg-green-600 text-white rounded px-4 py-2 block"
                    : "px-4 py-2 block hover:bg-gray-300 dark:text-white"
                }
              >
                {labels[index]}
              </NavLink>
            );
          })}
        </nav>
      </motion.aside>
    );
  }

  // ROLE BASED NAVIGATION LISTS
const patientNav = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Appointment", to: "/appointment" },
  { label: "Bills", to: "/bills" },
  { label: "Documents", to: "/documents" },
  { label: "Notice Board", to: "/notice" },
  { label: "Invoice", to: "/invoice" },
  { label: "Live Consultations", to: "/consultations" },
  { label: "Patient Cases", to: "/patient-cases" },
  { label: "Prescriptions", to: "/prescriptions" },
  { label: "Reports", to: "/reports" },
  { label: "Setting", to: "/setting/profile" },
];

const doctorNav = [
  { label: "Home", to: "/" },
  { label: "Appointment", to: "/appointment" },
  { label: "Doctors", to: "/doctors" },
  { label: "Schedules", to: "/schedules" },
  { label: "Prescription", to: "/prescription" },
  { label: "Documents", to: "/documents" },
  { label: "Diagnosis", to: "/diagnosis" },
  { label: "Notice Board", to: "/notice-board" },
  { label: "Live Consultation", to: "/consultation" },
  { label: "My Payroll", to: "/payroll" },
  { label: "Patients", to: "/patients" },
  { label: "Reports", to: "/reports" },
  { label: "SMS", to: "/sms" },
  { label: "Setting", to: "/setting/profile" },
];

const adminNav = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Users", to: "/admin/users" },
  { label: "Doctors", to: "/admin/doctors" },
  { label: "Appointments", to: "/admin/appointments" },
  { label: "Departments", to: "/admin/departments" },
  { label: "Payments", to: "/admin/payments" },
  { label: "Reports", to: "/admin/reports" },
  { label: "Setting", to: "/setting/profile" },
];


  // RENDER NAV HELPER
  const renderNav = (list) =>
    list.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={onClose}
        className={({ isActive }) =>
          isActive
            ? "text-white w-[90%] bg-green-600 px-4 py-2 rounded"
            : "px-4 py-2 hover:bg-gray-300 hover:text-black dark:text-white w-[90%] rounded"
        }
      >
        {item.label}
      </NavLink>
    ));

  return (
    <motion.aside
      initial={{ x: "-100%" }}
      animate={{ x: isOpen ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 90 }}
      className="md:hidden fixed top-0 left-0 bg-gray-200 dark:bg-gray-900 w-64 h-full z-40 overflow-y-auto mt-16"
    >
      {/* NAVIGATION */}
      <nav className="flex flex-col items-center space-y-3 p-2">
        {user?.role === "PATIENT" && renderNav(patientNav)}
        {user?.role === "DOCTOR" && renderNav(doctorNav)}
        {user?.role === "ADMIN" && renderNav(adminNav)}

        {/* LOGOUT */}
        <motion.button
          onClick={() => {
            logout();
            onClose();
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-600 font-semibold text-white p-2 rounded m-2 cursor-pointer hover:bg-red-500 w-[90%]"
        >
          Logout
        </motion.button>
      </nav>
    </motion.aside>
  );
};

export default MobileSidebar;
