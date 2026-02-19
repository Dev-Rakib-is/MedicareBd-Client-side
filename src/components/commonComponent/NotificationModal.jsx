import { X } from "lucide-react";
import api from "../../api/api";
import Spiner from "./Spiner";
import { useEffect, useState, useRef } from "react";

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    fetchNotification();
  }, []);

  // Fetch notifications
  const fetchNotification = async () => {
    try {
      const res = await api.get("/notifications/admin?page=1&limit=20");
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error("Failed to show notifications");
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Close on ESC press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="absolute top-16 right-2 w-80 bg-white shadow border border-teal-600/80 rounded-lg max-h-96 overflow-y-auto z-50"
    >
      <div className="flex justify-between items-center px-3 py-2 border-b">
        <h3 className="font-semibold">Notifications</h3>
        <X className="cursor-pointer" size={18} onClick={onClose} />
      </div>

      {loading ? (
        <Spiner perusal="Loading..." />
      ) : notifications.length === 0 ? (
        <p className="p-4 text-center text-gray-500">No Notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => markAsRead(n._id)}
            className={`p-3 border-b cursor-pointer transition ${
              n.isRead ? "bg-gray-100" : "bg-blue-50 border-l-4 border-blue-500"
            }`}
          >
            <div>{n.title}</div>
            <div className="text-xs">{n.message}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationModal;
