import { motion } from "motion/react";
import { useAuth } from "../contex/AuthContex";
import { Link, NavLink } from "react-router";
import logo from "/Tritmo.png";

const DesktopSidebar = () => {
  const { user, logout } = useAuth();

  const navItems = {
    PATIENT: [
      { label: "Home", to: "/" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Appointment", to: "/appointment" },
      { label: "Doctors", to: "/admin/doctors/patient" },
      { label: "Live Consultations", to: "/consultations" },
      { label: "Prescriptions", to: "/prescriptions" },
      { label: "Reports", to: "/reports" },
      { label: "Documents", to: "/documents" },
      { label: "Patient Cases", to: "/patient-cases" },
      { label: "Bills", to: "/bills" },
      { label: "Invoice", to: "/invoice" },
      { label: "Notifications", to: "/notifications" },
      { label: "Notice Board", to: "/notice" },
      { label: "Settings", to: "/setting/account" },
    ],
    DOCTOR: [
      { label: "Home", to: "/" },
      { label: "Appointments", to: "/appointment" },
      { label: "Schedules", to: "/schedules" },
      { label: "Patients", to: "/patients" },
      { label: "Diagnosis", to: "/diagnosis" },
      { label: "Prescription", to: "/prescriptions" },
      { label: "Reports", to: "/reports" },
      { label: "Documents", to: "/documents" },
      { label: "Notifications", to: "/notifications" },
      { label: "Live Consultations", to: "/consultations" },
      { label: "Notice Board", to: "/notice-board" },
      { label: "SMS", to: "/sms" },
      { label: "Doctors", to: "/doctors" },
      { label: "My Payroll", to: "/payroll" },
      { label: "Settings", to: "/setting/account" },
    ],
    ADMIN: [
      { label: "Dashboard", to: "/admin/dashboard" },
      { label: "Users", to: "/admin/users" },
      { label: "Doctors", to: "/admin/doctors" },
      { label: "Departments", to: "/admin/departments" },
      { label: "Payments", to: "/admin/payments" },
      { label: "Reports", to: "/admin/reports" },
      { label: "Notifications", to: "/notifications" },
      { label: "Settings", to: "/setting/account" },
    ],
    PUBLIC: [
      { label: "Home", to: "/" },
      { label: "Login", to: "/login" },
      { label: "Registration", to: "/registration" },
    ],
  };

  //  navigation
  const renderNav = (items) =>
    items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `w-full px-4 py-2 rounded text-left block ${
            isActive
              ? "bg-green-600 text-white"
              : "text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:text-black"
          }`
        }
      >
        {item.label}
      </NavLink>
    ));

  return (
    <aside className="hidden md:flex flex-col bg-gray-200 dark:bg-gray-900 w-64 h-screen border-r border-black/40 dark:border-white/40 overflow-y-auto">
      
      {/* logo section */}
      <div className="border-b border-black/40 dark:border-white/40 bg-white dark:bg-gray-900 fixed top-0 left-0 w-64 z-10">
        <Link to="/" className="flex items-center gap-2 px-4 py-1.5">
          <img src={logo} alt="main logo" className="w-14 h-auto" />
          <div className="line-hight">
            <p className="text-xl font-bold">Tritmo</p>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Appointment
            </span>
          </div>
        </Link>
      </div>

      {/* navigation */}
      <nav className="flex flex-col gap-1 mt-24 px-2">
        {user ? renderNav(navItems[user.role]) : renderNav(navItems.PUBLIC)}
      </nav>

      {/* logout */}
      {user && (
        <motion.button
          onClick={logout}
          whileTap={{ scale: 0.95 }}
          className="mt-auto m-3 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-500"
        >
          Logout
        </motion.button>
      )}
    </aside>
  );
};

export default DesktopSidebar;
