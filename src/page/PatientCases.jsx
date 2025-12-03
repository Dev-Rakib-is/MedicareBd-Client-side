import { useEffect, useState } from "react";
import api from "../api/api";

const PatientCases = ({ patientId }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCases = async () => {
    try {
      const res = await api.get(`/patient-cases/${patientId}`);
      setCases(res.data?.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Not Found");
      } else {
        setError("Failed to load cases");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    fetchCases();
  }, [patientId]);

  if (loading)
    return (
      <div className="mt-16 max-w-3xl mx-auto space-y-2">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-16">
        {error}
      </p>
    );

  if (!cases.length)
    return (
      <p className="text-center mt-16 text-gray-500">
        No cases found.
      </p>
    );

  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Patient Cases</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border-b border-gray-300">Date</th>
            <th className="p-2 border-b border-gray-300">Doctor</th>
            <th className="p-2 border-b border-gray-300">Diagnosis</th>
          </tr>
        </thead>

        <tbody>
          {cases.map((c) => (
            <tr key={c._id} className="border-b border-gray-200">
              <td className="p-2">
                {new Date(c.date).toLocaleDateString("en-GB")}
              </td>
              <td className="p-2">{c.doctorId?.name || "N/A"}</td>
              <td className="p-2">{c.diagnosis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientCases;
