import { Link, NavLink, useNavigate } from "react-router";
import { useMediaQuery } from "react-responsive";
import { AnimatePresence, motion } from 'motion/react';
import MobileSidebar from "./MobileSidebar";

const SettingsSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const menu = [
    { label: "Account", to: "/setting/account" },
    { label: "Preferences", to: "/setting/preferences" },
    { label: "Notifications", to: "/setting/notifications" },
    { label: "Security", to: "/setting/security" },
  ];

  const isDesktop = useMediaQuery({ minWidth: 768 });

  const mobileClass = isOpen
    ? "fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50 p-4 transition-transform transform translate-x-0"
    : "fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50 p-4 transition-transform transform -translate-x-full";

  return (
    <>
      {/* Desktop Sidebar */}
      {isDesktop && (
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-black shadow-md space-y-2 sticky top-0 h-screen border-r dark:border-white/40 border-black/40">
                    <div className="text-center mb p-4 border-b border-black/40 dark:border-white/40">
          <Link to="/" className="text-2xl font-bold text-green-600">
            Doctor
          </Link>
          <h5 className="font-light text-green-600">appointment</h5>
        </div>
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "bg-green-600 text-white px-4 py-2 rounded font-medium"
                  : "text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:text-black px-4 py-2 rounded transition"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </aside>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
      {!isDesktop && isOpen && (          
            <motion.aside 
             key={MobileSidebar}    
             initial={{ x: "-100%" }}
             animate={{ x: 0 }}
             exit={{x:"-100%"}}
             transition={{ type: "spring", stiffness: 90 }}
             className={`${mobileClass} mt-16 bg-white dark:bg-gray-950`}>
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? "bg-green-600 text-white px-4 py-2 rounded font-medium block mb-2"
                  : "text-gray-700 dark:text-white hover:bg-gray-200 px-4 py-2 rounded block mb-2"
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex gap-2">
            <button
            onClick={onClose}
            className="p-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
          <button onClick={()=>navigate("/")} className="text-white p-2 bg-red-500 rounded">Home</button>
          </div>
        </motion.aside>
         
      )}
       </AnimatePresence>
    </>
  );
};

export default SettingsSidebar;
