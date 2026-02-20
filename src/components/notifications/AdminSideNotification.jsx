import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import api from "../../api/api";

const AdminNotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    recipientRole: "ALL",
    recipientId: "",
  });

  const [currentUser, setCurrentUser] = useState(null);

  // ================= FETCH CURRENT USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setCurrentUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchUser();
  }, []);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  // ================= SOCKET.IO =================
  useEffect(() => {
    if (!currentUser) return;

    socket.connect();

    socket.emit("register-user", {
      userId: currentUser._id,
      role: currentUser.role,
    });

    const handleNotification = (notif) => {
      if (
        notif.recipientType === "ADMIN" ||
        notif.recipientType === "ALL" ||
        notif.recipientId?.toString() === currentUser._id.toString()
      ) {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [currentUser]);

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = async () => {
    if (!currentUser) return;

    try {
      const res = await api.get("/notifications/admin?page=1&limit=50");

      const notifs = res.data.notifications || [];

      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async () => {
    if (!form.message) return alert("Message is required");

    try {
      await api.post("/notifications", {
        title: form.title,
        message: form.message,
        recipientRole:
          form.recipientRole === "SINGLE" ? null : form.recipientRole,
        recipientId: form.recipientRole === "SINGLE" ? form.recipientId : null,
      });

      setForm({
        title: "",
        message: "",
        recipientRole: "ALL",
        recipientId: "",
      });

      fetchNotifications();
      alert("Notification sent successfully");
    } catch (err) {
      console.error("STATUS:", err.response?.status);
      console.error("DATA:", err.response?.data);
      console.error("FULL:", err);
      alert("Failed to send notification");
    }
  };

  // ================= READ =================
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/read/${id}`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <div className="p-2 mt-16">
      <div className="max-w-xl p-4 bg-white shadow">
        <h2 className="font-bold text-lg mb-4">Send Notification</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        />

        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        />

        <select
          name="recipientRole"
          value={form.recipientRole}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
        >
          <option value="ALL">All Users</option>
          <option value="DOCTOR">Doctors</option>
          <option value="PATIENT">Patients</option>
          <option value="SINGLE">Specific User</option>
        </select>

        {form.recipientRole === "SINGLE" && (
          <select
            name="recipientId"
            value={form.recipientId}
            onChange={handleChange}
            className="w-full border p-2 mb-2 rounded"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>

      <div className="max-w-xl p-2 bg-white mt-4 shadow relative">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h2>

          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-blue-600 text-sm">
              Mark all read
            </button>
          )}
        </div>

        <div className="w-full bg-white shadow-lg rounded-lg p-3 border max-h-96 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500">No notifications</p>
          )}

          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              className={`p-2 mb-2 border rounded cursor-pointer ${
                n.isRead ? "bg-gray-100" : "bg-white font-semibold"
              }`}
            >
              <div>{n.title}</div>
              <div className="text-xs">{n.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationPanel;
