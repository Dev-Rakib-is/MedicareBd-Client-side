import { useState, useMemo } from "react";
import { PlusCircle } from "lucide-react";

import { useNotices } from "../hooks/useNotice";
import NoticeFilters from "../components/Notice/NoticeFilters";
import NoticeItem from "../components/Notice/NoticeItem";
import Pagination from "../components/Notice/Pagination";
import  { CreateNoticeModal, PreviewModal, CommentsModal } from "../components/Notice/NoticeModals";

export default function NoticeBoard({ userRole = "PATIENT" }) {
  const { notices, loading, error, search, setSearch, filterVisible, setFilterVisible, page, setPage, limit, total, fetchNotices, setNotices } = useNotices(userRole);
  const totalPages = useMemo(() => Math.ceil(total / limit) || 1, [total, limit]);

  const [createOpen, setCreateOpen] = useState(false);
  const [previewNotice, setPreviewNotice] = useState(null);
  const [commentsFor, setCommentsFor] = useState(null);

  const handleDelete = async (id) => { /* same as previous */ };
  const handleMarkRead = async (id, read) => { /* same as previous */ };

  return (
    <div className="max-w-5xl mx-auto mt-16 p-6 space-y-6">
      {/* Filters + Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notice Board</h1>
          <p className="text-sm text-gray-600">Latest announcements from administration</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <NoticeFilters search={search} setSearch={setSearch} filterVisible={filterVisible} setFilterVisible={setFilterVisible} onRefresh={() => fetchNotices({ page: 1 })} />
          {userRole === "ADMIN" && (
            <button onClick={() => setCreateOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
              <PlusCircle size={16} /> Create Notice
            </button>
          )}
        </div>
      </div>

      {/* Notices List */}
      {loading ? <div>Loading notices...</div> :
       error ? <div className="text-red-600">{error}</div> :
       notices.length === 0 ? <div>No notices found.</div> :
       <ul>{notices.map(n => <NoticeItem key={n._id} notice={n} userRole={userRole} onDelete={handleDelete} onMarkRead={handleMarkRead} onPreview={setPreviewNotice} onComments={setCommentsFor} />)}</ul>
      }

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={p => { setPage(p); fetchNotices({ page: p }); }} />

      <CreateNoticeModal createOpen={createOpen} setCreateOpen={setCreateOpen} setNotices={setNotices} />
      <PreviewModal previewNotice={previewNotice} setPreviewNotice={setPreviewNotice} />
      <CommentsModal commentsFor={commentsFor} setCommentsFor={setCommentsFor} />
    </div>
  );
}
