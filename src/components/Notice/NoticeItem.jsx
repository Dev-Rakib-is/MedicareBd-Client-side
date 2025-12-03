import React from "react";
import { Trash, MessageCircle } from "lucide-react";

export default function NoticeItem({ notice, userRole, onDelete, onMarkRead, onPreview, onComments }) {
  return (
    <li className="p-4 border rounded bg-white flex flex-col md:flex-row justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">{notice.title}</h3>
            <p className="text-sm text-gray-500">{new Date(notice.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${notice.priority === "high" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
              {notice.priority === "high" ? "High" : "Normal"}
            </span>
            {userRole === "ADMIN" && (
              <button onClick={() => onDelete(notice._id)} className="text-red-600 p-1 rounded hover:bg-red-50" title="Delete">
                <Trash size={16} />
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-700 line-clamp-3">{notice.message}</p>

        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <button className="text-sm underline text-blue-600" onClick={() => onPreview(notice)}>View details</button>
          <button className="text-sm px-2 py-1 border rounded" onClick={() => onComments(notice._id)} title="Comments">
            <MessageCircle size={14} className="inline-block mr-1" /> Comments ({notice.commentsCount || 0})
          </button>
          <button onClick={() => onMarkRead(notice._id, !(notice.read))} disabled={notice._localUpdating} className={`text-sm px-2 py-1 rounded ${notice.read ? "bg-gray-100" : "bg-green-600 text-white"}`}>
            {notice.read ? "Mark unread" : "Mark read"}
          </button>
          {notice.fileUrl && (
            <a href={notice.fileUrl} target="_blank" rel="noreferrer" className="text-sm underline text-gray-700">
              Attachment
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
