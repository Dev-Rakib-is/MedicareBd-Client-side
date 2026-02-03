import { useEffect, useState } from "react";
import api from "../api/api";
import DoctorSideDiagnosis from "../components/diagnosis/DoctorSideDiagnosis";
import PatientSideDiagnosis from "../components/diagnosis/PatientSideDiagnosis";

export default function Diagnosis() {
  const [user, setUser] = useState(null);
  const [patientId, setPatientId] = useState("");

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  if (user.role === "doctor") {
    return (
      <div className="mt-16 p-2">
        <h1 className="text-2xl font-bold mb-4">Doctor Diagnosis Panel</h1>
        <input
          type="text"
          placeholder="Enter patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        {patientId && <DoctorSideDiagnosis patientId={patientId} />}
      </div>
    );
  }

  return <PatientSideDiagnosis />;
}
