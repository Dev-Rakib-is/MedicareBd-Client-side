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
    recipientRole: "all",
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

  // ================= SOCKET.IO (FIXED) =================
  useEffect(() => {
    if (!currentUser) return;

    // ✅ connect once
    socket.connect();

    // ✅ register admin
    socket.emit("register-user", {
      userId: currentUser._id,
      role: currentUser.role,
    });

    console.log("✅ Admin socket registered:", currentUser._id);

    // ✅ listener
    const handleNotification = (notif) => {
      if (
        notif.recipientType?.toLowerCase() === "admin" ||
        notif.recipientType?.toLowerCase() === "all" ||
        notif.recipientId === currentUser._id
      ) {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("newNotification", handleNotification);

    // cleanup only listener (NOT disconnect)
    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, [currentUser]);

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = async () => {
    if (!currentUser) return;

    try {
      const res = await api.get("/notifications/admin?page=1&limit=50");
      console.log(res.data.notifications);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
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
        recipientRole: form.recipientRole,
        recipientId: form.recipientId || null,
      });

      setForm({
        title: "",
        message: "",
        recipientRole: "all",
        recipientId: "",
      });

      fetchNotifications();
      alert("Notification sent successfully");
    } catch (err) {
      console.error(err);
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
          <option value="all">All Users</option>
          <option value="doctor">Doctors</option>
          <option value="patient">Patients</option>
          <option value="single">Specific User</option>
        </select>

        {form.recipientRole === "single" && (
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

      <div className="max-w-xl p-2 bg-white mt-4 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold">Notifications</h2>

          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-blue-600 text-sm">
              Mark all read
            </button>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="absolute right-0 top-10 w-64 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-3 border border-gray-300 dark:border-gray-600 z-50 max-h-96 overflow-y-auto">
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
        )}
      </div>
    </div>
  );
};

export default AdminNotificationPanel;
