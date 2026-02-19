import { Bell, TextAlignStart, X, Video } from "lucide-react";
import { useAuth } from "../contex/AuthContex";
import logo from "/Company logo.png";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useNotifications } from "../hooks/useNotifications";
import { useVideoConsultation } from "../hooks/useVideoConsultation";
import NotificationModal from "../components/commonComponent/NotificationModal";
import { useState } from "react";

const Navbar = ({ onHamburgerClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // 🔔 Notification Hook
  const { notifications, unreadCount, popupNotif, setPopupNotif } =
    useNotifications();

  // 🎥 Video Consultation Hook
  const { activeAppointment, joinVideo } = useVideoConsultation();

  const displayname =
    user?.username ||
    user?.profile?.name ||
    user?.name ||
    (user?.role === "DOCTOR"
      ? "Doctor"
      : user?.role === "PATIENT"
        ? "Patient"
        : user?.role === "ADMIN"
          ? "Admin"
          : "Guest");

  const settingPath = () => "/setting/account";

  return (
    <>
      <div className="flex justify-between items-center bg-gray-300 dark:bg-gray-800 px-6 py-3 border-b dark:border-white/40 border-black/40 fixed top-0 left-0 right-0 md:left-64 z-50">
        {/* Left Side */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden cursor-pointer"
            onClick={onHamburgerClick}
          >
            <TextAlignStart className="w-7 h-7 dark:text-white" />
          </motion.button>

          <img
            onClick={() => navigate("/")}
            src={logo}
            alt="Company logo"
            className="w-10 h-10 cursor-pointer"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 relative">
          {/* Profile Info */}
          <div className="text-black dark:text-white hidden md:block">
            <p className="text-base font-semibold">{displayname}</p>
            <p className="font-extralight text-sm">{user?.role}</p>
          </div>

          {/* 🎥 Active Video Call Indicator */}
          {activeAppointment && (
            <button
              onClick={joinVideo}
              className="relative flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-xs animate-pulse"
            >
              <Video size={16} />
              Join Call
            </button>
          )}

          {/* 🔔 Notification Icon */}
          {user && (
            <div className="relative inline-block">
              <Bell
                size={32}
                className="cursor-pointer text-yellow-600"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
              />

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] px-1 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}

              {/* Popup Notification */}
              {popupNotif && (
                <div className="absolute right-0 top-10 w-64 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-3 border border-gray-300 dark:border-gray-600 z-50">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm">
                      {popupNotif.title || "New Notification"}
                    </p>
                    <X
                      size={16}
                      className="cursor-pointer"
                      onClick={() => setPopupNotif(null)}
                    />
                  </div>
                  <p className="text-xs">{popupNotif.message}</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {new Date(popupNotif.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Profile Avatar */}
          {user?.photo_url && (
            <img
              onClick={() => navigate(settingPath())}
              src={user.photo_url}
              alt="profile"
              className="w-10 h-10 rounded-full border border-black/40 dark:border-white/40 object-cover cursor-pointer"
            />
          )}
        </div>
      </div>

      {/*  Notification Modal  */}
      {isNotificationOpen && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setIsNotificationOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
