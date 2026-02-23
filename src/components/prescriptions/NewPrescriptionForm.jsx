import { useState } from "react";
import api from "../../api/api";

const NewPrescriptionForm = ({ patientId, onCreated }) => {
  const [medications, setMedications] = useState([
    { name: "", dose: "", frequency: "" },
  ]);

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const addMedicine = () => {
    setMedications([...medications, { name: "", dose: "", frequency: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = async () => {
    if (!medications.length) return alert("Add medicines");

    try {
      setLoading(true);

      const res = await api.post("/prescriptions", {
        patientId,
        medications,
        notes,
      });

      onCreated?.(res.data.data);

      setMedications([{ name: "", dose: "", frequency: "" }]);
      setNotes("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-xl bg-white shadow mt-6">
      <h3 className="font-bold text-lg mb-4">New Prescription</h3>

      {/* Medicines */}
      <div className="space-y-3">
        {medications.map((m, i) => (
          <div key={i} className="grid md:grid-cols-3 gap-3">
            <input
              placeholder="Medicine name"
              value={m.name}
              onChange={(e) => handleChange(i, "name", e.target.value)}
              className="border p-2 rounded"
            />

            <input
              placeholder="Dose"
              value={m.dose}
              onChange={(e) => handleChange(i, "dose", e.target.value)}
              className="border p-2 rounded"
            />

            <input
              placeholder="Frequency"
              value={m.frequency}
              onChange={(e) => handleChange(i, "frequency", e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        ))}
      </div>

      <button onClick={addMedicine} className="mt-3 text-blue-600 text-sm">
        + Add Medicine
      </button>

      {/* Notes */}
      <textarea
        placeholder="Doctor advice..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border p-3 rounded mt-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Saving..." : "Create Prescription"}
      </button>
    </div>
  );
};

export default NewPrescriptionForm;
