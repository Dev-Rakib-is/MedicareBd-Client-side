import { useState, useEffect } from "react";
import api from '../../api/api';

export default function PatientSideDiagnosis() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiagnoses = async () => {
    try {
      const res = await api.get("/diagnosis/patient/me"); 
      setDiagnoses(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch your diagnoses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  if (loading) return <p>Loading diagnoses...</p>;

  return (
    <div className="mt-16 p-2">
      <h2 className="text-xl font-bold mb-4">Your Diagnoses</h2>
      {diagnoses.length === 0 && <p>No diagnoses found.</p>}
      {diagnoses.map((d) => (
        <div key={d._id} className="border p-2 rounded mb-2">
          <p>
            <strong>Diagnosis:</strong> {d.diagnosis}
          </p>
          {d.notes && (
            <p>
              <strong>Notes:</strong> {d.notes}
            </p>
          )}
          <p className="text-sm text-gray-500">
            By Dr. {d.doctorId?.name} on{" "}
            {new Date(d.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
