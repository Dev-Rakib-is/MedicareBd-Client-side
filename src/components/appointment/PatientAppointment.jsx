import { useEffect, useState } from "react";
import api from "../../api/api"; 
import { X } from "lucide-react"; 
const STATUS_OPTIONS = ["All", "Pending", "Accepted", "Approved", "Completed", "Cancelled", "Rejected"];

const PatientAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null); 

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/appointments/patient"); 
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Fetch appointments error:", err);
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments
  const filtered = filter === "All"
    ? appointments
    : appointments.filter(a => (a.status || "").toLowerCase() === filter.toLowerCase());

  // Cancel appointment
  const cancelAppointment = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      setSaving(true);
      const res = await api.patch(`/appointments/status/update`, { appointmentId: id, status: "CANCELLED" });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: "Cancelled" } : a));
      alert(res.data?.message || "Appointment cancelled");
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setSaving(false);
    }
  };

  // Open / Close details modal
  const openDetails = (appt) => setSelected(appt);
  const closeDetails = () => setSelected(null);

  // Join live consultation
  const joinLive = async (appt) => {
    try {
      if (appt.liveUrl) {
        window.open(appt.liveUrl, "_blank");
        return;
      }

      setSaving(true);
      const res = await api.post(`/appointments/${appt._id}/live`);
      const liveUrl = res.data.liveUrl || res.data.url;
      if (liveUrl) {
        setAppointments(prev => prev.map(a => a._id === appt._id ? { ...a, liveUrl } : a));
        window.open(liveUrl, "_blank");
      } else {
        alert("Live URL not returned from server");
      }
    } catch (err) {
      console.error("Live join error:", err);
      alert(err.response?.data?.message || "Failed to start/join live consultation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-16 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <p className="text-sm text-gray-600">Manage and join your consultations</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="border px-3 py-2 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button
            onClick={fetchAppointments}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Loading / Error / Empty */}
      {loading ? (
        <div className="text-center py-20">Loading appointments...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-600">No appointments found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <article key={a._id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={a.doctor?.photo_url || a.doctor?.photo || "/default-avatar.png"}
                  alt={a.doctor?.name || "Doctor"}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h3 className="font-semibold">{a.doctor?.name || "Doctor"}</h3>
                  <p className="text-sm text-gray-600">{a.doctor?.specialization || "General"}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(a.date).toLocaleDateString()} • {new Date(a.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />

                <button
                  onClick={() => openDetails(a)}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Details
                </button>

                {["Accepted", "Approved"].includes((a.status || "").toString()) && (
                  <button
                    onClick={() => joinLive(a)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                    disabled={saving}
                  >
                    Join Live
                  </button>
                )}

                {["Pending"].includes((a.status || "").toString()) && (
                  <button
                    onClick={() => cancelAppointment(a._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 relative">
            <button onClick={closeDetails} className="absolute right-4 top-4 text-gray-600">
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-2">Appointment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{selected.doctor?.name}</p>

                <p className="text-sm text-gray-500 mt-3">Specialization</p>
                <p>{selected.doctor?.specialization}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">{new Date(selected.date).toLocaleString()}</p>

                <p className="text-sm text-gray-500 mt-3">Status</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="mt-1">{selected.notes || "No extra notes."}</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              {["Pending"].includes((selected.status || "").toString()) && (
                <button
                  onClick={() => { cancelAppointment(selected._id); closeDetails(); }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Cancel Appointment
                </button>
              )}
              <button onClick={closeDetails} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointment;

// Helper component for status badges
const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const classes =
    s === "pending" ? "bg-orange-100 text-orange-800" :
    s === "accepted" ? "bg-yellow-100 text-yellow-800" :
    s === "approved" ? "bg-green-100 text-green-800" :
    s === "completed" ? "bg-blue-100 text-blue-800" :
    s === "cancelled" ? "bg-red-100 text-red-800" :
    "bg-gray-100 text-gray-800";

  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes}`}>{status || "Unknown"}</span>;
};