import { useEffect, useState } from "react";
import api from "../api/api";

const ReportRow = ({ r, onDelete }) => {
  return (
    <tr className="border-b">
      <td className="p-2">{new Date(r.date).toLocaleDateString("en-GB")}</td>
      <td className="p-2">{r.doctorId?.name || "N/A"}</td>
      <td className="p-2">{r.title}</td>
      <td className="p-2">{r.summary}</td>
      <td className="p-2">
        <button
          onClick={() => onDelete(r._id)}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const NewReportForm = ({ patientId, onCreated }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!patientId) return setError("Patient ID missing");

    try {
      setLoading(true);
      const payload = { patientId, title, summary };
      const res = await api.post("/reports", payload);

      if (res.data?.success) {
        onCreated(res.data.data);
        setTitle("");
        setSummary("");
      } else setError("Failed to create");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="font-semibold mb-2">Add Report</h3>

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Report Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="Summary..."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Saving..." : "Save Report"}
      </button>
    </form>
  );
};

const Reports = ({ patientId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchList = async () => {
    if (!patientId) {
      setError("Patient ID missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/reports/${patientId}`);

      if (res.data?.success) setReports(res.data.data || []);
      else setError("Failed to load");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [patientId]);

  const handleCreated = (rep) => {
    setReports((s) => [rep, ...s]);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this report?")) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports((s) => s.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <NewReportForm patientId={patientId} onCreated={handleCreated} />

      {loading ? (
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500">No reports found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Doctor</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Summary</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <ReportRow key={r._id} r={r} onDelete={handleDelete} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
