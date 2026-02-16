import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  X,
  RefreshCw,
  Calendar,
  Clock,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const STATUS_OPTIONS = ["All", "Pending", "Accepted", "Completed", "Rejected"];

const DoctorSideAppointment = () => {
  const [appts, setAppts] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppts = async (p = page) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(
        `/appointments/doctor?page=${p}&limit=${limit}`,
      );
      setAppts(res.data.appointments || []);
      setTotalPages(Math.ceil((res.data.totalAppointments || 0) / limit));
      setPage(res.data.page || p);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppts(1);
  }, []);

  const filtered =
    filter === "All"
      ? appts
      : appts.filter((a) => a.status?.toLowerCase() === filter.toLowerCase());

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.patch("/appointments/status/update", {
        appointmentId: id,
        status: newStatus,
      });
      setAppts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
      );
      alert(`Status updated to ${newStatus}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="p-6 max-w-5xl mx-auto mt-16 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your consultations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchAppts(page)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />{" "}
            Refresh
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchAppts(1)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === "All"
              ? "You don't have any appointments yet."
              : `No appointments with status "${filter}" found.`}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((a) => {
            const isUpdating = updatingId === a._id;
            return (
              <div
                key={a._id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={
                      a.patient?.photo_url ||
                      a.patient?.photo ||
                      "/default-avatar.png"
                    }
                    alt={a.patient?.name || "Patient"}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {a.patient?.name || "Patient"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {a.patient?.country || "Country not specified"}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(a.date)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{a.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={a.status} />
                  <button
                    onClick={() => setSelected(a)}
                    disabled={isUpdating}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Details
                  </button>
                  {a.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateStatus(a._id, "ACCEPTED")}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center gap-2 disabled:opacity-50"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {isUpdating ? "Accepting..." : "Accept"}
                      </button>
                      <button
                        onClick={() => updateStatus(a._id, "REJECTED")}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 flex items-center gap-2 disabled:opacity-50"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        {isUpdating ? "Rejecting..." : "Reject"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => fetchAppts(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchAppts(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selected && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Appointment Details
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <img
                    src={
                      selected.patient?.photo_url ||
                      selected.patient?.photo ||
                      "/default-avatar.png"
                    }
                    alt={selected.patient?.name}
                    className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">
                      {selected.patient?.name}
                    </h3>
                    <p className="text-gray-600">
                      {selected.patient?.email || "Email not available"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selected.patient?.country || "Country not specified"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(selected.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900">
                      {selected.timeSlot}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Appointment ID
                    </p>
                    <p className="font-mono text-gray-900 text-sm">
                      {selected._id?.slice(-8)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Reason
                  </p>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selected.reason || "No reason provided."}
                  </p>
                </div>
                {selected.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Additional Notes
                    </p>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selected.notes}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-8 pt-6 border-t">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || "";
  const getStyle = () => {
    if (s === "pending")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s === "accepted") return "bg-blue-100 text-blue-800 border-blue-200";
    if (s === "approved") return "bg-green-100 text-green-800 border-green-200";
    if (s === "completed") return "bg-gray-100 text-gray-800 border-gray-300";
    if (s === "cancelled" || s === "rejected")
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };
  const icon =
    {
      pending: "⏳",
      accepted: "✓",
      approved: "✅",
      completed: "✓",
      cancelled: "✗",
      rejected: "✗",
    }[s] || "?";
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border ${getStyle()}`}
    >
      <span>{icon}</span>
      {status}
    </span>
  );
};

export default DoctorSideAppointment;
