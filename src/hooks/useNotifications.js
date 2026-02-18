import { useState, useEffect } from "react";
import api from "../api/api";
import socket from "../utils/socket";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch Notifications – শুধু টোকেন থাকলে
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return; // লগইন না থাকলে কল করবে না
    }

    try {
      setLoading(true);
      const res = await api.get(`/notifications`, {
        params: { search, page, limit },
      });

      const list = res.data.notifications || [];
      setNotifications(list);
      setTotal(res.data.total || 0);

      const unread = list.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read/unread
  const markAsRead = async (id, read) => {
    try {
      await api.patch(`/notifications/${id}`, { read });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read } : n)),
      );
      setUnreadCount((prev) => (read ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  // Setup socket connection & real-time updates
  useEffect(() => {
    fetchNotifications();

    if (!socket.connected) {
      socket.connect();
    }

    const handleNewNotification = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      if (!notif.read) setUnreadCount((prev) => prev + 1);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [page, search]);

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
