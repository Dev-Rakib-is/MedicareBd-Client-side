import { useEffect, useState } from "react";
import api from "../../api/api";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reports (admin)
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports"); 
      setReports(res.data || []); 
    } catch (err) {
      console.error(err);
      setError("Failed to load admin reports");
    } finally {
      setLoading(false);
    }
  };

  // Delete a report
  const deleteReport = async (id) => {
    if (!confirm("Are you sure to delete this report?")) return;

    try {
      await api.delete(`/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <div className="p-6">Loading admin reports...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-2 mt-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold pb-3">Admin Reports</h1>
        <span className="text-sm text-gray-500">
          Total Reports: {reports.length}
        </span>
      </div>

      {/* Reports Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="p-3">Patient</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Created Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            )}

            {reports.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{r.patient?.name || "N/A"}</td>
                <td className="p-3">{r.doctor?.name || "N/A"}</td>
                <td className="p-3">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => deleteReport(r._id)}
                    className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
