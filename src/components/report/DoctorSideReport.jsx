import { useState, useEffect } from "react";
import api from "../../api/api";

const DoctorReports = () => {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [reports, setReports] = useState([]);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  // ================= fetch patients =================
  const fetchPatients = async () => {
    const res = await api.get("/patient/patient-list");
    if (res.data.success) setPatients(res.data?.data);
  };

  // ================= fetch reports =================
  const fetchReports = async () => {
    if (!patientId) return;

    const res = await api.get(`/reports/${patientId}`);
    if (res.data.success) setReports(res.data.data);
  };

  // ================= create =================
  const createReport = async () => {
    if (!patientId) return alert("Select patient first");

    await api.post("/reports", { patientId, title, summary });

    setTitle("");
    setSummary("");
    fetchReports();
  };

  const deleteReport = async (id) => {
    await api.delete(`/reports/${id}`);
    fetchReports();
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [patientId]);

  return (
    <div className="p-2 mt-16 max-w-3xl">
      <h2 className="text-xl font-bold mb-4">Doctor Reports</h2>

      {/* Patient dropdown */}
      <select
        className="border p-2 w-full mb-3"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      >
        <option value="">Select Patient</option>
        {patients.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name} ({p.email})
          </option>
        ))}
      </select>

      {/* create */}
      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <button
        onClick={createReport}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Create Report
      </button>

      {/* reports */}
      {reports.map((r) => (
        <div key={r._id} className="border p-3 mb-2 rounded">
          <p>{r.title}</p>
          <p>{r.summary}</p>

          <button
            onClick={() => deleteReport(r._id)}
            className="bg-red-600 text-white px-2 py-1 mt-2 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default DoctorReports;
