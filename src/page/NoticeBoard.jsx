import { useEffect, useState } from "react";
import api from "../api/api";
import AdminSideNotice from './../components/noticeBoard/AdminSideNotice';
import DoctorSideNotice from './../components/noticeBoard/DoctorSideNotice';
import PatientSideNotice from './../components/noticeBoard/PatientSideNotice';

export default function NoticeBoard() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= GET USER ROLE =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // assume you have auth/me or profile endpoint
        const res = await api.get("/auth/me");
        setRole(res.data.user.role); // ADMIN | DOCTOR | PATIENT
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ================= LOADER =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  // ================= ROLE BASED RENDER =================
  if (role === "ADMIN") return <AdminSideNotice />;
  if (role === "DOCTOR") return <DoctorSideNotice />;
  if (role === "PATIENT") return <PatientSideNotice />;

  return <p className="p-6">Unauthorized</p>;
}
