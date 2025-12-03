// src/components/Notice/NoticeModals.jsx
import { useState } from "react";
import { X } from "lucide-react";
import api from "../../api/api";

export function CreateNoticeModal({ createOpen, setCreateOpen, setNotices }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.post("/notices", { title, message });
      setNotices(prev => [res.data.notice, ...prev]);
      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Create failed");
    } finally {
      setSaving(false);
    }
  };

  if (!createOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-lg relative">
        <button type="button" onClick={() => setCreateOpen(false)} className="absolute top-3 right-3 text-gray-600"><X /></button>
        <h2 className="text-xl font-semibold mb-4">Create Notice</h2>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 rounded mb-2" />
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message" className="w-full border px-3 py-2 rounded mb-2" />
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "Creating..." : "Create Notice"}</button>
        </div>
      </form>
    </div>
  );
}

export function PreviewModal({ previewNotice, setPreviewNotice }) {
  if (!previewNotice) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl relative">
        <button onClick={() => setPreviewNotice(null)} className="absolute top-3 right-3 text-gray-600"><X /></button>
        <h2 className="text-xl font-semibold mb-2">{previewNotice.title}</h2>
        <p>{previewNotice.message}</p>
      </div>
    </div>
  );
}

export function CommentsModal({ commentsFor, setCommentsFor }) {
  if (!commentsFor) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl relative">
        <button onClick={() => setCommentsFor(null)} className="absolute top-3 right-3 text-gray-600"><X /></button>
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        <p>Comments modal for notice ID: {commentsFor}</p>
      </div>
    </div>
  );
}

// default export for easy import
export default { CreateNoticeModal, PreviewModal, CommentsModal };
