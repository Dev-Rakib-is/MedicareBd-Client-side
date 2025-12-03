export default function Pagination({ page, totalPages, total, onPageChange }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">Page {page} of {totalPages} — {total} notices</div>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
