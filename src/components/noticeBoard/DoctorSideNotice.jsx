import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from './../../api/api';

export default function DoctorSideNotice() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/notices");
      setNotices(res.data.data || []);
    } catch {
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notices/${id}/read`);
    load();
  };

  const markUnread = async (id) => {
    await api.patch(`/notices/${id}/unread`);
    load();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-16 space-y-4">
      <h1 className="text-2xl font-bold">Doctor Notices</h1>

      {notices.length === 0 && <p>No notices available</p>}

      {notices.map((n) => (
        <div key={n._id} className="border rounded-lg p-4 shadow-sm bg-white">
          <div className="flex justify-between">
            <h2 className="font-semibold text-lg">{n.title}</h2>

            <span
              className={`text-xs px-2 py-1 rounded ${
                n.isRead
                  ? "bg-gray-200 text-gray-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {n.isRead ? "Read" : "Unread"}
            </span>
          </div>

          <p className="text-gray-600 mt-2">{n.message}</p>

          <div className="flex gap-3 mt-3">
            {!n.isRead ? (
              <button
                onClick={() => markRead(n._id)}
                className="text-blue-600 text-sm"
              >
                Mark Read
              </button>
            ) : (
              <button
                onClick={() => markUnread(n._id)}
                className="text-gray-600 text-sm"
              >
                Mark Unread
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}