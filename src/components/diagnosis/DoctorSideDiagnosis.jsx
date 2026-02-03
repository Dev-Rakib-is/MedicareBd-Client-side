import { useEffect, useState } from "react";
import api from "../../api/api";

export default function DoctorSideDiagnosis() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [diagnoses, setDiagnoses] = useState([]);
  const [diagnosisText, setDiagnosisText] = useState("");
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= fetch patients =================
  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients/patient-list");

      if (res.data.success) {
        setPatients(res.data.data);

        // auto select first patient
        if (res.data.data.length > 0) {
          handleSelectPatient(res.data.data[0]);
        }
      }
    } catch (err) {
      alert("Failed to load patients");
    }
  };

  // ================= fetch diagnoses =================
  const fetchDiagnoses = async (pid) => {
    try {
      const res = await api.get(`/diagnosis/patient/${pid}`);
      if (res.data.success) setDiagnoses(res.data.data);
    } catch {
      alert("Failed to load diagnoses");
    }
  };

  const handleSelectPatient = (p) => {
    setSelectedPatient(p);
    fetchDiagnoses(p._id);
  };

  // ================= create/update =================
  const saveDiagnosis = async () => {
    if (!selectedPatient) return;
    if (!diagnosisText) return alert("Diagnosis required");

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/diagnosis/${editingId}`, {
          diagnosis: diagnosisText,
          notes,
        });
      } else {
        await api.post("/diagnosis", {
          patientId: selectedPatient._id,
          diagnosis: diagnosisText,
          notes,
        });
      }

      setDiagnosisText("");
      setNotes("");
      setEditingId(null);

      fetchDiagnoses(selectedPatient._id);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (d) => {
    setDiagnosisText(d.diagnosis);
    setNotes(d.notes || "");
    setEditingId(d._id);
  };

  const deleteDiagnosis = async (id) => {
    await api.delete(`/diagnosis/${id}`);
    fetchDiagnoses(selectedPatient._id);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="flex mt-16 h-[80vh]">
      {/* LEFT */}
      <div className="w-1/3 border-r p-3 overflow-y-auto">
        <h3 className="font-bold mb-3">Patients</h3>

        {patients.map((p) => (
          <div
            key={p._id}
            onClick={() => handleSelectPatient(p)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              selectedPatient?._id === p._id
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {p.name}
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex-1 p-4">
        {!selectedPatient ? (
          <p>Select a patient</p>
        ) : (
          <>
            <h2 className="font-bold text-lg mb-2">
              Diagnosis → {selectedPatient.name}
            </h2>

            {editingId && (
              <p className="text-orange-600 text-sm mb-2">
                Editing diagnosis...
              </p>
            )}

            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Diagnosis"
              value={diagnosisText}
              onChange={(e) => setDiagnosisText(e.target.value)}
            />

            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              onClick={saveDiagnosis}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded mb-4"
            >
              {loading ? "Saving..." : editingId ? "Update" : "Add"} Diagnosis
            </button>

            {diagnoses.map((d) => (
              <div key={d._id} className="border p-2 mb-2 rounded">
                <p>{d.diagnosis}</p>
                <p className="text-sm text-gray-500">{d.notes}</p>

                <button
                  onClick={() => handleEdit(d)}
                  className="text-blue-600 mr-3"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteDiagnosis(d._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
