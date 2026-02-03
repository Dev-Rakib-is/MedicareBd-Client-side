import { motion } from "motion/react";
import { useAuth } from "../contex/AuthContex";
import { Link, NavLink } from "react-router";
import logo from "/Tritmo.png"; 
import { getNavByRole } from './navItems';

const DesktopSidebar = () => {
  const { user, logout } = useAuth();

  const menu = getNavByRole(user?.role);

  const renderNav = (items) =>
    items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `w-full px-4 py-2 rounded block transition ${
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
      {/* LOGO */}
      <div className="border-b border-black/40 dark:border-white/40 bg-white dark:bg-gray-900 fixed top-0 left-0 w-64 z-10">
        <Link to="/" className="flex items-center gap-2 px-4 py-1.5">
          <img src={logo} alt="main logo" className="w-14 h-auto" />
          <div>
            <p className="text-xl font-bold">Tritmo</p>
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Appointment
            </span>
          </div>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-1 mt-24 px-2">{renderNav(menu)}</nav>

      {/* LOGOUT */}
      {user && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="mt-auto m-3 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-500"
        >
          Logout
        </motion.button>
      )}
    </aside>
  );
};

export default DesktopSidebar;
