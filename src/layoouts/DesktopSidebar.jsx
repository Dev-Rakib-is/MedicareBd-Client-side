import { motion } from "motion/react";
import { useAuth } from "../contex/AuthContex";
import { Link, NavLink } from "react-router";

const DesktopSidebar = () => {
  const { user, logout } = useAuth();

  // Public (No User)
  if (!user) {
    return (
      <aside className="hidden md:flex flex-col bg-gray-200 dark:bg-gray-900 w-64 h-screen overflow-y-auto border-r border-black/40 dark:border-white/40">
        <div className="text-center mb-4 p-4 border-b border-black/40 dark:border-white/40">
          <Link to="/" className="text-2xl font-bold text-green-600">
            Doctor
          </Link>
          <h5 className="font-light text-green-600">appointment</h5>
        </div>

        <nav className="space-y-3 flex-1 p-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-green-600 text-white rounded px-4 py-2 block"
                : "px-4 py-2 block hover:bg-gray-300 dark:text-white dark:hover:text-black"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "bg-green-600 text-white rounded px-4 py-2 block"
                : "px-4 py-2 block hover:bg-gray-300 dark:text-white dark:hover:text-black"
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/registration"
            className={({ isActive }) =>
              isActive
                ? "bg-green-600 text-white rounded px-4 py-2 block"
                : "px-4 py-2 block hover:bg-gray-300 dark:text-white dark:hover:text-black"
            }
          >
            Registration
          </NavLink>
        </nav>

        <div className="flex flex-col items-center mb-4">
          <p className="dark:text-white">Emergency Number :</p>
          <a
            href="tel:+8801796478185"
            className="hover:underline dark:text-white"
          >
            +8801796478185
          </a>
        </div>
      </aside>
    );
  }

const patientNav = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Appointment", to: "/appointment" },
  { label: "Bills", to: "/bills" },
  { label: "Documents", to: "/documents" },
  { label: "Notice Board", to: "/notice" },
  { label: "Invoice", to: "/invoice" },
  { label: "Notifications", to: "/notifications" },
  { label: "Live Consultations", to: "/consultations" },
  { label: "Patient Cases", to: "/patient-cases" },
  { label: "Prescriptions", to: "/prescriptions" },
  { label: "Reports", to: "/reports" },
  { label: "Settings", to: "/setting/account" },
];

const doctorNav = [
  { label: "Home", to: "/" },
  { label: "Appointment", to: "/appointment" },
  { label: "Doctors", to: "/doctors" },
  { label: "Schedules", to: "/schedules" },
  { label: "Notifications", to: "/notifications" },
  { label: "Prescription", to: "/prescription" },
  { label: "Documents", to: "/documents" },
  { label: "Diagnosis", to: "/diagnosis" },
  { label: "Notice Board", to: "/notice-board" },
  { label: "Live Consultations", to: "/consultations" },
  { label: "My Payroll", to: "/payroll" },
  { label: "Patients", to: "/patients" },
  { label: "Reports", to: "/reports" },
  { label: "SMS", to: "/sms" },
  { label: "Settings", to: "/setting/account" },
];

const adminNav = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Users", to: "/admin/users" },
  { label: "Notifications", to: "/notifications" },
  { label: "Doctors", to: "/admin/doctors" },
  { label: "Departments", to: "/admin/departments" },
  { label: "Payments", to: "/admin/payments" },
  { label: "Reports", to: "/admin/reports" },
  { label: "Settings", to: "/setting/account" },
];

  const renderNav = (list) =>
    list.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
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
    <aside className="hidden md:flex flex-col bg-gray-200 dark:bg-gray-900 w-64 h-screen overflow-y-auto border-r border-black/40 dark:border-white/40">
      <div className="text-center mb-4 p-2 border-b border-black/40 bg-white dark:bg-gray-900 dark:border-white/40 fixed top-0 left-0 w-64">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Doctor
        </Link>
        <h5 className="font-light text-green-600">appointment</h5>
      </div>

      {/* ROLE BASED NAVIGATION */}
      <nav className="flex flex-col space-y-3 items-center p-2 mt-20">
        {user?.role === "PATIENT" && renderNav(patientNav)}
        {user?.role === "DOCTOR" && renderNav(doctorNav)}
        {user?.role === "ADMIN" && renderNav(adminNav)}
      </nav>

      {/* Logout Button */}
      <motion.button
        onClick={() => logout()}
        whileTap={{ scale: 0.95 }}
        className="bg-red-600 font-semibold text-white p-2 rounded m-2 cursor-pointer block hover:bg-red-500 w-[90%]"
      >
        Logout
      </motion.button>
    </aside>
  );
};

export default DesktopSidebar;
