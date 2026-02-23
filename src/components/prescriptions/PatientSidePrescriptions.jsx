import { useEffect, useState } from "react";
import api from "../../api/api";

import PrescriptionPrintView from "./PrescriptionPrintView";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/prescriptions/me");
      setPrescriptions(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        My Prescriptions
      </h1>

      {loading && (
        <p className="text-center text-gray-500">Loading prescriptions...</p>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && prescriptions.length === 0 && (
        <p className="text-center text-gray-500">No prescriptions found.</p>
      )}

      <div className="space-y-8">
        {prescriptions.map((p) => (
          <div
            key={p._id}
            className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-lg transition"
          >
            {/* ===== HEADER ===== */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-xl font-bold text-gray-800">
                  Dr. {p.doctorId?.name || "N/A"}
                </p>

                <p className="text-sm text-gray-500">
                  {p.doctorId?.department}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(p.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Prescription
              </span>
            </div>

            {/* ===== SKELETON PRESCRIPTION ===== */}
            <PrescriptionPrintView prescription={p} />

            {/* ===== MEDICINE LIST ===== */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-gray-700">Medicines</h3>

              <div className="space-y-2">
                {p.medications?.map((m, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-gray-50 p-3 rounded-lg text-sm"
                  >
                    <span className="font-medium w-1/3">{m.name}</span>

                    <span className="w-1/3 text-gray-600">Dose: {m.dose}</span>

                    <span className="w-1/3 text-gray-600">
                      Frequency: {m.frequency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== NOTES ===== */}
            {p.notes && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2 text-gray-700">
                  Doctor Advice
                </h3>

                <p className="bg-blue-50 p-3 rounded text-sm text-gray-600">
                  {p.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
