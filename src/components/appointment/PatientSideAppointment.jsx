import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Calendar } from "lucide-react";

const PatientSideAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ================= FETCH APPOINTMENTS =================
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/appointments/patient");
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================= UI =================
  return (
    <div className="p-2 mt-16 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        My Appointments
      </h2>

      {loading && <p className="text-center">Loading appointments...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && appointments.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No appointments found
        </p>
      )}

      <div className="grid gap-4">
        {appointments.map((a) => (
          <div
            key={a._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Dr. {a.doctor?.name || "Doctor"}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {a.date ? new Date(a.date).toLocaleString() : "Date not set"}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Status: {a.status || "Pending"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {/* Join Live Button */}
              {["Scheduled", "ACCEPTED"].includes(a.status) && (
                <button
                  onClick={() => navigate(`/consultations/${a._id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Join Live
                </button>
              )}

              {/* Cancel Button */}
              {["Scheduled", "ACCEPTED"].includes(a.status) && (
                <button
                  onClick={async () => {
                    try {
                      await api.patch("/appointments/patient/cancel", {
                        appointmentId: a._id,
                      });
                      fetchAppointments();
                    } catch (err) {
                      console.error(err);
                      setError(
                        err.response?.data?.message || "Failed to cancel",
                      );
                      setTimeout(() => setError(""), 3000);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientSideAppointments;
