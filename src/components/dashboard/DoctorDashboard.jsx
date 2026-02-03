import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CalendarCheck, Users, Bell, Clock } from "lucide-react";
import api from "../../api/api";

const DoctorDashboard = () => {
  const [dashboard, setDashboard] = useState({
    appointments: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/doctors/dashboard");
        setDashboard(data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  const statsCards = [
    {
      icon: CalendarCheck,
      label: "Upcoming Appointments",
      value: dashboard.appointments.length,
      color: "blue",
    },
    {
      icon: Users,
      label: "Total Patients",
      value: new Set(dashboard.appointments.map((a) => a.patient?._id)).size,
      color: "green",
    },
    {
      icon: Clock,
      label: "Today Appointments",
      value: dashboard.appointments.filter(
        (a) => new Date(a.date).toDateString() === new Date().toDateString(),
      ).length,
      color: "purple",
    },
    {
      icon: Bell,
      label: "Notifications",
      value: dashboard.notifications.length,
      color: "yellow",
    },
  ];

  return (
    <div className="p-6 w-full max-w-7xl mx-auto space-y-6 mt-16">
      <h1 className="text-3xl font-bold dark:text-white">Doctor Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4"
          >
            <card.icon className={`w-10 h-10 text-${card.color}-500`} />
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                {card.label}
              </p>
              <p className="text-xl font-semibold dark:text-white">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
        <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
        {dashboard.appointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {dashboard.appointments.map((appt) => (
              <div
                key={appt._id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div>
                  <p className="font-semibold">
                    {appt.patient?.name || "Unknown Patient"}
                  </p>
                  <p className="text-gray-500 text-sm">{appt.date}</p>
                </div>
                <div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {appt.timeSlot || "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      {dashboard.notifications.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <ul className="list-disc pl-5 space-y-1">
            {dashboard.notifications.map((note, idx) => (
              <li key={idx} className="text-gray-600">
                {note.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
