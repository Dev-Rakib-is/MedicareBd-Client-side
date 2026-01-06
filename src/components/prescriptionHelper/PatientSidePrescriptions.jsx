import { useEffect, useState } from "react";
import api from "../../api/api";

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
    <div className="max-w-5xl mx-auto mt-16 p-6">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>

      {loading && <p>Loading prescriptions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && prescriptions.length === 0 && (
        <p className="text-gray-500">No prescriptions found.</p>
      )}

      <div className="space-y-4">
        {prescriptions.map((p) => (
          <div
            key={p._id}
            className="bg-white border rounded-lg shadow-sm p-5"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold text-lg">
                  Dr. {p.doctorId?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(p.date).toLocaleDateString("en-GB")}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded bg-green-100 text-green-700">
                Prescription
              </span>
            </div>

            <div className="mb-3">
              <h3 className="font-medium mb-1">Medicines</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {p.medications?.map((m, i) => (
                  <li key={i}>
                    <strong>{m.name}</strong> — {m.dose}, {m.frequency}
                  </li>
                ))}
              </ul>
            </div>

            {p.notes && (
              <div className="bg-gray-50 border rounded p-3 text-sm">
                <strong>Doctor Notes:</strong>
                <p className="text-gray-600 mt-1">{p.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
