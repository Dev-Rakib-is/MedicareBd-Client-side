// src/page/PatientDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../contex/AuthContex";
import api from "../../api/api";

const PatientDashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoadingDashboard(true);
        const res = await api.get("/patient/dashboard");
        setDashboard(res.data.dashboard);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoadingDashboard(false);
      }
    };

    const fetchRecentAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const res = await api.get("/patient/appointments");
        setRecentAppointments(res.data.appointments);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchDashboard();
    fetchRecentAppointments();
  }, []);

  return (
    <div className="p-6 space-y-6 mt-16">

      <h1 className="text-2xl font-bold">
        Welcome, {user?.name || "Patient"}
      </h1>
      <p className="text-gray-600">Here is your health overview</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-blue-100 border">
          <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
          <p className="text-3xl font-bold mt-2">
            {loadingDashboard ? "..." : dashboard?.upcomingAppointments ?? 0}
          </p>
        </div>

        <div className="p-5 rounded-lg bg-green-100 border">
          <h2 className="text-lg font-semibold">Completed Visits</h2>
          <p className="text-3xl font-bold mt-2">
            {loadingDashboard
              ? "..."
              : (dashboard?.totalAppointments ?? 0) - (dashboard?.upcomingAppointments ?? 0)}
          </p>
        </div>

        <div className="p-5 rounded-lg bg-yellow-100 border">
          <h2 className="text-lg font-semibold">Pending Reports</h2>
          <p className="text-3xl font-bold mt-2">
            {loadingDashboard ? "..." : dashboard?.totalPrescriptions ?? 0}
          </p>
        </div>

        <div className="p-5 rounded-lg bg-red-100 border">
          <h2 className="text-lg font-semibold">Health Score</h2>
          <p className="text-3xl font-bold mt-2">{loadingDashboard ? "..." : "87%"}</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white shadow rounded-lg p-5 border">
        <h2 className="text-xl font-semibold mb-3">Recent Appointments</h2>

        {loadingAppointments && <p>Loading appointments...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="divide-y">
          {!loadingAppointments && recentAppointments.length === 0 && (
            <li>No recent appointments found.</li>
          )}

          {recentAppointments.map((appt) => (
            <li key={appt._id} className="py-3 flex justify-between">
              <span className="font-medium">
                Dr. {appt.doctor?.name || "N/A"} — {appt.doctor?.specialization || "General"}
              </span>
              <span className="text-sm text-gray-500">
                {appt.date ? new Date(appt.date).toLocaleDateString() : "N/A"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientDashboard;
