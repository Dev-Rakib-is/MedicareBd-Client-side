import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from './../../api/api';

export default function AdminSideNotice() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const [editingId, setEditingId] = useState(null);

  // ================= LOAD =================
  const loadNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notices");
      setNotices(res.data.data || []);
    } catch {
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.title || !form.message)
        return toast.error("All fields required");

      if (editingId) {
        await api.put(`/notices/${editingId}`, form);
        toast.success("Notice updated");
      } else {
        await api.post("/notices", form);
        toast.success("Notice created");
      }

      setForm({ title: "", message: "" });
      setEditingId(null);
      loadNotices();
    } catch {
      toast.error("Action failed");
    }
  };

  // ================= DELETE =================
  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    await api.delete(`/notices/${id}`);
    toast.success("Deleted");
    loadNotices();
  };

  // ================= EDIT =================
  const startEdit = (n) => {
    setEditingId(n._id);
    setForm({
      title: n.title,
      message: n.message,
    });
  };

  // ================= READ / UNREAD =================
  const toggleRead = async (n) => {
    if (n.isRead) {
      await api.patch(`/notices/${n._id}/unread`);
    } else {
      await api.patch(`/notices/${n._id}/read`);
    }
    loadNotices();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-16 space-y-6">
      <h1 className="text-2xl font-bold">Admin Notice Panel</h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 space-y-3"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm((p) => ({ ...p, title: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) =>
            setForm((p) => ({ ...p, message: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Notice" : "Create Notice"}
        </button>
      </form>

      {/* ================= LIST ================= */}
      <div className="space-y-3">
        {notices.length === 0 && <p>No notices found</p>}

        {notices.map((n) => (
          <div
            key={n._id}
            className="border rounded p-4 flex justify-between items-center bg-white shadow-sm"
          >
            <div>
              <h2 className="font-semibold">{n.title}</h2>
              <p className="text-sm text-gray-600">{n.message}</p>

              <span
                className={`text-xs mt-1 inline-block px-2 py-1 rounded ${
                  n.isRead
                    ? "bg-gray-200 text-gray-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {n.isRead ? "Read" : "Unread"}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleRead(n)}
                className="text-sm text-blue-600"
              >
                Toggle
              </button>

              <button
                onClick={() => startEdit(n)}
                className="text-sm text-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteNotice(n._id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}