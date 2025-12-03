import { Outlet, useLocation } from "react-router";
import { useState } from "react";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";
import SettingsSidebar from "./SettingsSidebar"; 

const RootLayouts = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Check if current route is under settings
  const isSettingsRoute = location.pathname.startsWith("/setting");

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar */}
      {isSettingsRoute ? (
        <SettingsSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      ) : (
        <MobileSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      {!isSettingsRoute && <DesktopSidebar className="w-64" />}

      <div className="flex flex-col flex-1 overflow-auto">
        <Navbar onHamburgerClick={() => setMenuOpen(!menuOpen)} />
        <main className="px-2 flex-1 dark:bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayouts;
