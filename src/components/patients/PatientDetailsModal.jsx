import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { XCircle } from "lucide-react";

export default function PatientDetailsModal({ patientId, onClose, onPatientUpdated }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  async function fetchDetails() {
    setLoading(true);
    try {
      const res = await api.get(`/patient/${patientId}`);
      setPatient(res.data.patient || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!patientId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow-lg w-full max-w-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Patient Details</h3>
          <button onClick={onClose} title="Close" className="text-red-600">
            <XCircle />
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Age:</strong> {patient.age || "N/A"}</p>
                <p><strong>Phone:</strong> {patient.phone || "N/A"}</p>
                <p><strong>City:</strong> {patient.city || "N/A"}</p>
              </div>
              <div>
                <p><strong>Last Visit:</strong> {patient.lastVisit ? new Date(patient.lastVisit).toLocaleString() : "—"}</p>
                <p><strong>Blood Group:</strong> {patient.bloodGroup || "—"}</p>
                <p><strong>Notes:</strong></p>
                <p className="text-sm text-gray-600">{patient.notes || "No notes"}</p>
              </div>
            </div>

            {/* medical history preview (if returned) */}
            <div className="mt-4">
              <h4 className="font-semibold">Recent Appointments / History</h4>
              {patient.history?.length ? (
                <ul className="list-disc pl-5 text-sm">
                  {patient.history.map((h) => (
                    <li key={h._id || h.date}>
                      {h.title || "Visit"} — {new Date(h.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No history found.</p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  onClose();
                  // optionally open consult page
                  window.location.href = `/consultation/new?patient=${patient._id}`;
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Start Consultation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
