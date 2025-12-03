import { Outlet } from "react-router";

const SettingsLayout = () => {


  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-black">
      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-4 overflow-auto mt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;
