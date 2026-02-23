import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contex/AuthContex";

import PrescriptionPrintView from "./PrescriptionPrintView";
import PrescriptionSignatureBox from "./PrescriptionSignatureBox";
import NewPrescriptionForm from "./NewPrescriptionForm";

/* ================= MODAL ================= */
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl rounded-xl p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl font-bold text-gray-500"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

/* ================= MAIN ================= */
const DoctorSidePrescriptionSide = () => {
  const { user } = useAuth();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchingPatients, setFetchingPatients] = useState(false);

  /* FETCH PATIENTS */
  useEffect(() => {
    if (!user || user.role !== "DOCTOR") return;

    setFetchingPatients(true);

    api
      .get("/patient/patient-list")
      .then((res) => setPatients(res.data.data || []))
      .finally(() => setFetchingPatients(false));
  }, [user]);

  /* FETCH PRESCRIPTIONS */
  useEffect(() => {
    if (!selectedPatient) return;

    setLoading(true);

    api
      .get(`/prescriptions/patient/${selectedPatient._id}`)
      .then((res) => setPrescriptions(res.data.data || []))
      .finally(() => setLoading(false));
  }, [selectedPatient]);

  /* DELETE */
  const handleDelete = async (p) => {
    if (p.isFinalized) {
      alert("Finalized prescription cannot be deleted");
      return;
    }

    if (!window.confirm("Delete prescription?")) return;

    await api.delete(`/prescriptions/${p._id}`);

    setPrescriptions((prev) => prev.filter((x) => x._id !== p._id));
  };

  const handlePrescriptionCreated = (newPrescription) => {
    setPrescriptions((prev) => [newPrescription, ...prev]);
  };

  const handleFinalize = async (id) => {
    try {
      await api.post(`/prescriptions/finalize/${id}`);
      alert("Prescription finalized");
      setPrescriptions((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isFinalized: true, status: "FINALIZED" } : p,
        ),
      );
    } catch {
      alert("Finalize failed");
    }
  };

  if (!user || user.role !== "DOCTOR") {
    return (
      <div className="p-8 text-center text-red-500">Unauthorized Access</div>
    );
  }

  return (
    <div className="p-6 mt-16 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Patient Management</h1>

      {/* PATIENT LIST */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Patient List</h2>

        {fetchingPatients ? (
          <p>Loading patients...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {patients.map((p) => (
              <div
                key={p._id}
                onClick={() => setSelectedPatient(p)}
                className="border p-4 rounded bg-white cursor-pointer hover:border-green-500"
              >
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-500">{p.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal open={!!selectedPatient} onClose={() => setSelectedPatient(null)}>
        <h2 className="text-2xl font-bold mb-4">
          Prescriptions for {selectedPatient?.name}
        </h2>

        {/* CREATE PRESCRIPTION */}
        <NewPrescriptionForm
          patientId={selectedPatient?._id}
          onCreated={handlePrescriptionCreated}
        />

        <h3 className="font-bold mt-8 mb-4">Previous Prescriptions</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          prescriptions.map((p) => (
            <div key={p._id} className="border rounded-xl p-5 mb-6 bg-white">
              <PrescriptionPrintView prescription={p} />

              {/* Signature */}
              {!p.isFinalized && (
                <PrescriptionSignatureBox prescriptionId={p._id} />
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                {!p.isFinalized && (
                  <>
                    <button
                      onClick={() => handleFinalize(p._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Finalize Prescription
                    </button>

                    <button
                      onClick={() => handleDelete(p)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}

                {p.isFinalized && (
                  <span className="text-green-600 font-semibold">
                    ✓ Finalized
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
};

export default DoctorSidePrescriptionSide;
