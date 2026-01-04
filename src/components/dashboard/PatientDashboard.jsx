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
  
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // appointments per page
  const [totalAppointments, setTotalAppointments] = useState(0);

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

    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const res = await api.get(`/appointments/patient?page=${page}&limit=${limit}`);
        setRecentAppointments(res.data.appointments);
        setTotalAppointments(res.data.totalAppointments || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchDashboard();
    fetchAppointments();
  }, [page, limit]);

  // Cancel appointment
  const handlePatientCancel = async (appointmentId) => {
    try {
      const res = await api.patch("/appointments/patient/cancel", { appointmentId });
      setRecentAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId
            ? { ...appt, status: "CANCELLED", cancelledBy: "PATIENT", cancelReason: res.data.appointment.cancelReason || "" }
            : appt
        )
      );
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(totalAppointments / limit);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

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
            <li key={appt._id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">
                  Dr. {appt.doctor?.name || "N/A"} — {appt.doctor?.specialization || "General"}
                </p>
                <p className="text-sm text-gray-500">
                  {appt.date ? new Date(appt.date).toLocaleDateString() : "N/A"}
                </p>

                {appt.status === "CANCELLED" && appt.cancelledBy && (
                  <p className="text-sm text-red-500 mt-1">
                    ❌ Cancelled by {appt.cancelledBy.toLowerCase()}
                    {appt.cancelReason && ` — Reason: ${appt.cancelReason}`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  appt.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                  appt.status === "ACCEPTED" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {appt.status}
                </span>

                {appt.status === "PENDING" && (
                  <button
                    onClick={() => handlePatientCancel(appt._id)}
                    className="text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 border rounded">{page} / {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
