import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from './../../api/api';

export default function PatientSideNotice() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({});

  const loadNotices = async () => {
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
    loadNotices();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notices/${id}/read`);
    loadNotices();
  };

  const addComment = async (id) => {
    if (!comment[id]) return;

    await api.post(`/notices/${id}/comments`, {
      text: comment[id],
    });

    setComment((p) => ({ ...p, [id]: "" }));
    toast.success("Comment added");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4 mt-16">
      <h1 className="text-xl font-bold">Notices</h1>

      {notices.map((n) => (
        <div
          key={n._id}
          className={`border rounded p-4 ${
            n.isRead ? "bg-gray-50" : "bg-blue-50"
          }`}
        >
          <h2 className="font-semibold">{n.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{n.message}</p>

          <div className="flex gap-3 mt-3">
            {!n.isRead && (
              <button
                onClick={() => markRead(n._id)}
                className="text-sm text-blue-600"
              >
                Mark Read
              </button>
            )}
          </div>

          {/* Comment */}
          <div className="flex gap-2 mt-3">
            <input
              value={comment[n._id] || ""}
              onChange={(e) =>
                setComment((p) => ({ ...p, [n._id]: e.target.value }))
              }
              placeholder="Write comment..."
              className="border px-2 py-1 rounded w-full"
            />
            <button
              onClick={() => addComment(n._id)}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
