import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "./../../api/api";

const DoctorSideNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const socketUrl =
    import.meta.env.VITE_SOCKET_SERVER || "http://localhost:5000";

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const socket = io(socketUrl, {
      withCredentials: true,
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    const role = user?.role?.toUpperCase();

    if (userId) {
      socket.emit("register-user", { userId, role });
      console.log("Socket registered:", userId);
    }

    socket.on("newNotification", (notif) => {
      if (
        notif.recipientType?.toUpperCase() === role ||
        notif.recipientType?.toUpperCase() === "ALL" ||
        notif.recipientId === userId
      ) {
        setNotifications((prev) => [notif, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [socketUrl]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="max-w-3xl mx-auto mt-16 p-5 text-center">Loading...</div>
    );

  if (error) return <p className="text-center text-red-500 mt-16">{error}</p>;

  return (
    <div className="max-w-3xl mt-16 p-2">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-lg border shadow-sm flex justify-between items-center ${
                n.isRead ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <div>
                <p className="font-medium">{n.title || "Notification"}</p>
                <p>{n.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSideNotification;
