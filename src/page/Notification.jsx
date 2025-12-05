import { useEffect, useState } from "react";
import api from "../api/api";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");

      // Optional chaining and fallback to empty array
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError("Failed to load notifications");
      setNotifications([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  // Skeleton loader component
  const SkeletonItem = () => (
    <div className="p-4 rounded-lg shadow-sm animate-pulse flex justify-between items-center bg-gray-200">
      <div className="space-y-2 w-full">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="h-6 w-20 bg-gray-300 rounded"></div>
    </div>
  );

  if (loading)
    return (
      <div className="max-w-3xl mx-auto mt-16 p-5 space-y-3">
        {[...Array(5)].map((_, idx) => (
          <SkeletonItem key={idx} />
        ))}
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 mt-16">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-16 p-5">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-lg border shadow-sm flex justify-between items-center
              ${n.isRead ? "bg-gray-100" : "bg-blue-50"}`}
            >
              <div>
                <p className="font-medium">{n.message}</p>
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

export default Notification;
