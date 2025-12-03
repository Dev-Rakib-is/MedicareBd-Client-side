import { useState, useEffect } from "react";
import api from "../api/api";
import { io } from "socket.io-client";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Real-time socket connection
    const socket = io("https://madicarebd.onrender.com");
    socket.on("new-notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => socket.disconnect();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/notifications`, {
        params: { search, page, limit }
      });
      setNotifications(res.data.notifications);
      setTotal(res.data.total);
      const unread = res.data.notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, read) => {
    try {
      await api.patch(`/notifications/${id}`, { read });
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read } : n)
      );
      setUnreadCount(prev => read ? prev - 1 : prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    notifications,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    limit,
    total,
    unreadCount,
    fetchNotifications,
    markAsRead,
  };
}
