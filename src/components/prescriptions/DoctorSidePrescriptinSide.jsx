import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contex/AuthContex";


/* ================= MODAL ================= */
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

/* ================= FORM ================= */
const NewPrescriptionForm = ({ patientId, doctorId, onCreated }) => {
  const [meds, setMeds] = useState([{ name: "", dose: "", frequency: "" }]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (i, k, v) =>
    setMeds((s) => s.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const addMoreMedication = () => {
    setMeds([...meds, { name: "", dose: "", frequency: "" }]);
  };

  const removeMedication = (index) => {
    if (meds.length > 1) {
      setMeds(meds.filter((_, i) => i !== index));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/prescriptions", {
        patientId,
        medications: meds.filter(m => m.name.trim() && m.dose.trim() && m.frequency.trim()),
        notes,
      });
      onCreated(res.data.data);
      setMeds([{ name: "", dose: "", frequency: "" }]);
      setNotes("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="border border-gray-300 p-4 rounded-lg mb-6 bg-gray-50">
      <h3 className="font-bold text-lg mb-4 text-green-700">Add New Prescription</h3>

      {meds.map((m, i) => (
        <div key={i} className="flex gap-3 mb-3 items-center">
          <input
            className="border border-gray-300 p-2 rounded w-1/3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Medicine name"
            value={m.name}
            onChange={(e) => update(i, "name", e.target.value)}
            required
          />
          <input
            className="border border-gray-300 p-2 rounded w-1/3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Dose (e.g., 500mg)"
            value={m.dose}
            onChange={(e) => update(i, "dose", e.target.value)}
            required
          />
          <input
            className="border border-gray-300 p-2 rounded w-1/3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Frequency (e.g., 1+1+1)"
            value={m.frequency}
            onChange={(e) => update(i, "frequency", e.target.value)}
            required
          />
          {meds.length > 1 && (
            <button
              type="button"
              onClick={() => removeMedication(i)}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addMoreMedication}
        className="text-blue-600 hover:text-blue-800 text-sm mb-4 flex items-center gap-1"
      >
        <span className="text-lg">+</span> Add Another Medication
      </button>

      <textarea
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder="Additional notes for the patient..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />

      <button
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Prescription"}
      </button>
    </form>
  );
};

/* ================= MAIN COMPONENT ================= */
const DoctorSidePrescriptionSide = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPatients, setFetchingPatients] = useState(false);

  /* ================= FETCH PATIENTS ================= */
  useEffect(() => {
    if (!user || user.role !== "DOCTOR") return;

    setFetchingPatients(true);
    api
      .get("/patient/patient-list")
      .then((res) => {
        setPatients(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch patients:", err);
        alert("Could not load patient list. Please try again.");
      })
      .finally(() => {
        setFetchingPatients(false);
      });
  }, [user]);

  /* ================= FETCH PRESCRIPTIONS FOR SELECTED PATIENT ================= */
  useEffect(() => {
    if (!selectedPatient) {
      setPrescriptions([]);
      return;
    }

    setLoading(true);
    api
      .get(`/prescriptions/${selectedPatient._id}`)
      .then((res) => {
        setPrescriptions(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch prescriptions:", err);
        alert("Could not load prescriptions for this patient.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedPatient]);

  /* ================= DELETE PRESCRIPTION ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) {
      return;
    }

    try {
      await api.delete(`/prescriptions/${id}`);
      setPrescriptions((s) => s.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete prescription");
    }
  };

  const handlePrescriptionCreated = (newPrescription) => {
    setPrescriptions((prev) => [newPrescription, ...prev]);
  };

  if (!user || user.role !== "DOCTOR") {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 text-xl font-semibold">Unauthorized Access</p>
        <p className="text-gray-600 mt-2">Only doctors can view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-16">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Patient Management</h1>
      <p className="text-gray-600 mb-8">Click on a patient to view and manage their prescriptions.</p>

      {/* ================= PATIENT LIST ================= */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Patient List</h2>
        
        {fetchingPatients ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No patients found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((p) => (
              <div
                key={p._id}
                onClick={() => setSelectedPatient(p)}
                className="border border-gray-300 bg-white p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-green-500"
              >
                <p className="font-semibold text-lg text-gray-800">{p.name}</p>
                {p.age && <p className="text-sm text-gray-500">Age: {p.age}</p>}
                {p.gender && <p className="text-sm text-gray-500">Gender: {p.gender}</p>}
                <div className="mt-3 text-xs text-green-600 font-medium">
                  Click to view prescriptions →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PRESCRIPTION MODAL ================= */}
      <Modal open={!!selectedPatient} onClose={() => setSelectedPatient(null)}>
        <div className="p-2">
          <h2 className="text-2xl font-bold mb-1 text-gray-800">
            Prescriptions for <span className="text-green-700">{selectedPatient?.name}</span>
          </h2>
          <p className="text-gray-500 mb-6">{selectedPatient?.email}</p>

          <NewPrescriptionForm
            patientId={selectedPatient?._id}
            doctorId={user._id}
            onCreated={handlePrescriptionCreated}
          />

          <h3 className="font-bold text-lg mb-4 text-gray-700">Previous Prescriptions</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading prescriptions...</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No prescriptions found for this patient.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((p) => (
                <div key={p._id} className="border border-gray-300 bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-500">
                        Prescribed on: {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                      {p.doctorId && (
                        <p className="text-sm text-gray-600 mt-1">
                          By: Dr. {p.doctorId.name}
                          {p.doctorId.department && ` (${p.doctorId.department})`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {p.medications.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-800 min-w-[150px]">{m.name}</span>
                        <span className="text-gray-600">Dose: {m.dose}</span>
                        <span className="text-gray-600">Frequency: {m.frequency}</span>
                      </div>
                    ))}
                  </div>
                  
                  {p.notes && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">{p.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DoctorSidePrescriptionSide;