import { useEffect, useState } from "react";
import api from "../../api/api";
import { X, RefreshCw, Calendar, Clock, User, Video, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Accepted",
  "Approved",
  "Completed",
  "Cancelled",
  "Rejected",
];

const PatientAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [joiningId, setJoiningId] = useState(null);

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

  const filtered = filter === "All"
    ? appointments
    : appointments.filter(
        (a) => (a.status || "").toLowerCase() === filter.toLowerCase()
      );

  const cancelAppointment = async (id) => {
    try {
      setCancellingId(id);
      const res = await api.patch(`/appointments/status/update`, {
        appointmentId: id,
        status: "CANCELLED",
      });
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "Cancelled" } : a))
      );
      alert(res.data?.message || "Appointment cancelled");
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const joinLive = async (appt) => {
    try {
      setJoiningId(appt._id);
      if (appt.liveUrl) {
        window.open(appt.liveUrl, "_blank");
        return;
      }

      const res = await api.post(`/appointments/${appt._id}/live`);
      const liveUrl = res.data.liveUrl || res.data.url;
      if (liveUrl) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === appt._id ? { ...a, liveUrl } : a))
        );
        window.open(liveUrl, "_blank");
      } else {
        alert("Live URL not returned from server");
      }
    } catch (err) {
      console.error("Live join error:", err);
      alert(
        err.response?.data?.message || "Failed to start/join live consultation"
      );
    } finally {
      setJoiningId(null);
    }
  };

  const canJoinLive = (status) => {
    const statusLower = (status || "").toLowerCase();
    return ["accepted", "approved", "ongoing"].includes(statusLower);
  };

  const canCancel = (status) => {
    const statusLower = (status || "").toLowerCase();
    return ["pending", "accepted", "approved"].includes(statusLower);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25
      }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-5xl mx-auto mt-16 space-y-6"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and join your consultations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </motion.select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAppointments}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </div>
      </motion.header>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">Loading appointments...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAppointments}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {!loading && !error && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200"
          >
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === "All" 
                ? "You don't have any appointments yet." 
                : `No appointments with status "${filter}" found.`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointments List */}
      {!loading && !error && filtered.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filtered.map((a) => {
            const formattedDateTime = formatDateTime(a.date);
            
            return (
              <motion.article
                key={a._id}
                variants={itemVariants}
                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 border border-gray-200 rounded-xl bg-white"
              >
                <div className="flex items-center gap-4 flex-1">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={a.doctor?.photo_url || a.doctor?.photo || "/default-avatar.png"}
                    alt={a.doctor?.name || "Doctor"}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {a.doctor?.name || "Doctor"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {a.doctor?.specialization || "General"}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formattedDateTime.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formattedDateTime.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={a.status} />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelected(a)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Details
                  </motion.button>

                  {canJoinLive(a.status) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => joinLive(a)}
                      disabled={joiningId === a._id || saving}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Video className="w-4 h-4" />
                      {joiningId === a._id ? "Joining..." : "Join Live"}
                    </motion.button>
                  )}

                  {canCancel(a.status) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this appointment?")) {
                          cancelAppointment(a._id);
                        }
                      }}
                      disabled={cancellingId === a._id || saving}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 disabled:opacity-50"
                    >
                      {cancellingId === a._id ? "Cancelling..." : "Cancel"}
                    </motion.button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Appointment Details
                </h2>

                <div className="space-y-6">
                  {/* Doctor Info */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                  >
                    <img
                      src={selected.doctor?.photo_url || "/default-avatar.png"}
                      alt={selected.doctor?.name}
                      className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md"
                    />
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">
                        {selected.doctor?.name}
                      </h3>
                      <p className="text-gray-600">
                        {selected.doctor?.specialization}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {selected.doctor?.hospital || "Hospital not specified"}
                      </p>
                    </div>
                  </motion.div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDateTime(selected.date).date}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Time</p>
                        <p className="font-semibold text-gray-900">
                          {formatDateTime(selected.date).time}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <div className="mt-1">
                          <StatusBadge status={selected.status} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Appointment ID</p>
                        <p className="font-mono text-gray-900 text-sm">
                          {selected._id?.slice(-8)}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Notes */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selected.notes || "No extra notes provided."}
                    </p>
                  </motion.div>
                </div>

                {/* Modal Actions */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t"
                >
                  {canCancel(selected.status) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (window.confirm("Are you sure you want to cancel this appointment?")) {
                          cancelAppointment(selected._id);
                          setSelected(null);
                        }
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 font-medium"
                    >
                      Cancel Appointment
                    </motion.button>
                  )}
                  {canJoinLive(selected.status) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        joinLive(selected);
                        setSelected(null);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium flex items-center justify-center gap-2"
                    >
                      <Video className="w-5 h-5" />
                      Join Live Consultation
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelected(null)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  
  const statusConfig = {
    pending: {
      bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
      text: "text-yellow-700",
      border: "border border-yellow-200",
      icon: "⏳"
    },
    accepted: {
      bg: "bg-gradient-to-r from-blue-50 to-sky-50",
      text: "text-blue-700",
      border: "border border-blue-200",
      icon: "✓"
    },
    approved: {
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      text: "text-green-700",
      border: "border border-green-200",
      icon: "✅"
    },
    completed: {
      bg: "bg-gradient-to-r from-gray-50 to-gray-100",
      text: "text-gray-700",
      border: "border border-gray-300",
      icon: "✓"
    },
    cancelled: {
      bg: "bg-gradient-to-r from-red-50 to-pink-50",
      text: "text-red-700",
      border: "border border-red-200",
      icon: "✗"
    },
    rejected: {
      bg: "bg-gradient-to-r from-gray-50 to-gray-100",
      text: "text-gray-700",
      border: "border border-gray-300",
      icon: "✗"
    },
    default: {
      bg: "bg-gradient-to-r from-gray-50 to-gray-100",
      text: "text-gray-700",
      border: "border border-gray-300",
      icon: "?"
    }
  };

  const config = statusConfig[s] || statusConfig.default;

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${config.bg} ${config.text} ${config.border}`}
    >
      <span>{config.icon}</span>
      {status || "Unknown"}
    </motion.span>
  );
};

export default PatientAppointment;