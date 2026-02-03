import { motion } from "motion/react";
import { useAuth } from "../contex/AuthContex";
import { Link, NavLink } from "react-router";
import { X } from "lucide-react";
import logo from "/Tritmo.png";
import { getNavByRole } from './navItems';

const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const menu = getNavByRole(user?.role);

  const renderNav = (items) =>
    items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={onClose}
        className={({ isActive }) =>
          `w-[90%] px-4 py-2 rounded block transition ${
            isActive
              ? "bg-green-600 text-white"
              : "hover:bg-gray-300 dark:text-white"
          }`
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
      {/* HEADER */}
      <div className="flex justify-between p-4 border-b border-black/40 dark:border-white/40">
        <Link to="/" className="flex items-center gap-2 px-4 py-1.5">
          <img src={logo} alt="main logo" className="w-14 h-auto" />
          <div>
            <p className="text-xl font-bold">Tritmo</p>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Appointment
            </span>
          </div>
        </Link>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <X className="dark:text-white" />
        </motion.button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col items-center space-y-3 p-2 mt-2">
        {renderNav(menu)}

        {/* LOGOUT */}
        {user && (
          <motion.button
            onClick={() => {
              logout();
              onClose();
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 font-semibold text-white p-2 rounded m-2 cursor-pointer hover:bg-red-500 w-[90%] mt-auto"
          >
            Logout
          </motion.button>
        )}
      </nav>
    </motion.aside>
  );
};

export default MobileSidebar;
