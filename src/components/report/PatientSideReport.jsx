import { useEffect, useState } from "react";
import api from "../../api/api";

const PatientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await api.get("/reports/me");
      if (res.data.success) setReports(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/reports/${id}`);
    setReports((s) => s.filter((r) => r._id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-16 p-2">
      <h2 className="text-xl font-bold mb-4">My Reports</h2>

      {reports.map((r) => (
        <div key={r._id} className="border p-3 mb-2 rounded">
          <p>{r.title}</p>
          <p>{r.summary}</p>
          <button
            onClick={() => handleDelete(r._id)}
            className="bg-red-600 text-white px-3 py-1 rounded mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default PatientReports;
