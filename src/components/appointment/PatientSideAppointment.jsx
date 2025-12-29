import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  ChevronRight
} from "lucide-react";

const PatientSideAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch patient appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/appointments/patient", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(res.data.appointments || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Cancel appointment (Patient)
  const cancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        "/appointments/patient/cancel",
        { appointmentId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state
      setAppointments((prev) =>
        prev.map((ap) =>
          ap._id === id
            ? { ...ap, status: "CANCELLED", cancelledBy: "PATIENT" }
            : ap
        )
      );
      setShowCancelModal(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error(err);
      alert("Failed to cancel appointment");
    }
  };

  // Status badge component
  const StatusBadge = ({ status, cancelledBy }) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: <Clock className="w-3 h-3" />
      },
      ACCEPTED: {
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: <CheckCircle className="w-3 h-3" />
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        icon: <XCircle className="w-3 h-3" />
      },
      COMPLETED: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        icon: <CheckCircle className="w-3 h-3" />
      }
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span>{status}</span>
        {status === "CANCELLED" && cancelledBy && (
          <span className="text-xs opacity-75">• By {cancelledBy}</span>
        )}
      </div>
    );
  };

  // Payment badge component
  const PaymentBadge = ({ status }) => {
    const isPaid = status === "PAID";
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        isPaid 
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      }`}>
        <DollarSign className="w-3 h-3" />
        <span>{status || "UNPAID"}</span>
      </div>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 mt-16 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-16 max-w-6xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            Unable to Load Appointments
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 mt-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track your upcoming and past appointments
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
            <Calendar className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Upcoming</p>
              <p className="text-2xl font-bold">
                {appointments.filter(a => a.status === "ACCEPTED" || a.status === "PENDING").length}
              </p>
            </div>
            <Clock className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-2xl font-bold">
                {appointments.filter(a => a.status === "COMPLETED").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Payment</p>
              <p className="text-2xl font-bold">
                {appointments.filter(a => a.payment?.status !== "PAID").length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Appointments Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You don't have any appointments scheduled yet
          </p>
          <button
            onClick={() => window.location.href = '/find-doctors'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Book Your First Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((ap) => (
            <div
              key={ap._id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {ap.doctor?.name || "Dr. Unnamed"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {ap.doctor?.specialization || "General Physician"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={ap.status} cancelledBy={ap.cancelledBy} />
                        <PaymentBadge status={ap.payment?.status} />
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{new Date(ap.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{ap.timeSlot}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {(ap.status === "PENDING" || ap.status === "ACCEPTED") && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedAppointment(ap);
                            setShowCancelModal(true);
                          }}
                          className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={() => window.location.href = `/appointment/${ap._id}`}
                          className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
                        >
                          Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {ap.notes && (
                      <button
                        onClick={() => alert(`Notes: ${ap.notes}`)}
                        className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="View Notes"
                      >
                        <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {ap.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Notes:</span> {ap.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Cancel Appointment?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to cancel your appointment with{" "}
                <span className="font-semibold">{selectedAppointment.doctor?.name}</span>?
              </p>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(selectedAppointment.date).toLocaleDateString()} • {selectedAppointment.timeSlot}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => cancelAppointment(selectedAppointment._id)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSideAppointment;