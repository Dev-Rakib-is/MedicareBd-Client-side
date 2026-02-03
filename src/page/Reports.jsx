import { useEffect, useState } from "react";
import DoctorReports from "./../components/report/DoctorSideReport";
import api from "../api/api";
import PatientReports from "../components/report/PatientSideReport";
import AdminReports from "./../components/report/AdminReports";

const Reports = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");

      if (res.data?.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) return <p className="p-6 text-red-500">Unauthorized</p>;

  // ================= ROLE BASED UI =================

  if (user.role === "ADMIN") return <AdminReports />;

  if (user.role === "DOCTOR") return <DoctorReports />;

  if (user.role === "PATIENT") return <PatientReports />;

  return <p>Invalid role</p>;
};

export default Reports;
