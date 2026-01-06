import { useEffect, useState } from "react";
import { useAuth } from "../../contex/AuthContex";
import api from "../../api/api";

/* ===================== ROW ===================== */
const PrescriptionRow = ({ p, onDelete }) => {
  return (
    <tr className="border-b">
      <td className="p-2">
        {new Date(p.createdAt || p.date).toLocaleDateString("en-GB")}
      </td>
      <td className="p-2">{p.doctorId?.name || "N/A"}</td>
      <td className="p-2">
        {p.medications?.map((m, i) => (
          <div key={i}>
            <strong>{m.name}</strong> — {m.dose} · {m.frequency}
          </div>
        ))}
      </td>
      <td className="p-2">{p.notes || "-"}</td>
      <td className="p-2">
        <button
          onClick={() => onDelete(p._id)}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

/* ===================== FORM ===================== */
const NewPrescriptionForm = ({ patientId, doctorId, onCreated }) => {
  const [meds, setMeds] = useState([{ name: "", dose: "", frequency: "" }]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (i, k, v) =>
    setMeds((s) => s.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const submit = async (e) => {
    e.preventDefault();

    if (!patientId || !doctorId) {
      setError("Patient or Doctor missing");
      return;
    }

    const payload = {
      patientId,
      doctorId,
      medications: meds,
      notes,
    };

    try {
      setLoading(true);
      const res = await api.post("/prescriptions", payload);
      onCreated(res.data.data);
      setNotes("");
      setMeds([{ name: "", dose: "", frequency: "" }]);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="font-semibold mb-2">Add Prescription</h3>

      {meds.map((m, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            className="p-2 border rounded"
            placeholder="Medicine"
            value={m.name}
            onChange={(e) => update(i, "name", e.target.value)}
            required
          />
          <input
            className="p-2 border rounded"
            placeholder="Dose"
            value={m.dose}
            onChange={(e) => update(i, "dose", e.target.value)}
            required
          />
          <input
            className="p-2 border rounded"
            placeholder="Frequency"
            value={m.frequency}
            onChange={(e) => update(i, "frequency", e.target.value)}
            required
          />
        </div>
      ))}

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Saving..." : "Save Prescription"}
      </button>
    </form>
  );
};

/* ===================== MAIN ===================== */
const DoctorSidePrescriptinSide = ({ patientId }) => {
  const { user } = useAuth(); // logged-in doctor
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/prescriptions/${patientId}`);
        setPrescriptions(res.data.data || []);
      } catch (err) {
        console.error("Fetch prescriptions failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const handleCreated = (p) =>
    setPrescriptions((prev) => [p, ...prev]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/prescriptions/${id}`);
      setPrescriptions((s) => s.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (!patientId) {
    return <p className="text-red-500">Patient ID missing</p>;
  }

  if (!user || user.role !== "DOCTOR") {
    return <p className="text-red-500">Unauthorized</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 p-4">
      <h1 className="text-2xl font-bold mb-4">Prescriptions</h1>

      <NewPrescriptionForm
        patientId={patientId}
        doctorId={user._id}
        onCreated={handleCreated}
      />

      {loading ? (
        <p>Loading...</p>
      ) : prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Medications</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <PrescriptionRow
                key={p._id}
                p={p}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorSidePrescriptinSide;
