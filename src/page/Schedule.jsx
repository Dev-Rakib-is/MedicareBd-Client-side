import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  Edit,
  Save,
  X,
  CheckCircle,
  User,
} from "lucide-react";
import api from "./../api/api";

// ---------- Loader ----------
const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

// ---------- Time Picker ----------
const TimePicker = ({ value, onChange, disabled }) => {
  const slots = Array.from({ length: 24 * 4 }, (_, i) => {
    const h = Math.floor(i / 4);
    const m = (i % 4) * 15;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  });

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {slots.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
};

// ---------- Main Component ----------
export default function Schedule() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState({
    workingDays: [],
    workingHours: { from: "09:00", to: "17:00" },
    slotDuration: 30,
  });

  const days = [
    { id: "SUN", label: "Sun" },
    { id: "MON", label: "Mon" },
    { id: "TUE", label: "Tue" },
    { id: "WED", label: "Wed" },
    { id: "THU", label: "Thu" },
    { id: "FRI", label: "Fri" },
    { id: "SAT", label: "Sat" },
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const scheduleRes = await api.get("/doctors/my-schedules");
      const scheduleData = scheduleRes.data.data;

      setSchedule({
        workingDays: scheduleData.workingDays || [],
        workingHours: scheduleData.workingHours || {
          from: "09:00",
          to: "17:00",
        },
        slotDuration: scheduleData.slotDuration || 30,
      });

      // Get today's appointments
      const appRes = await api.get("/doctors/today-appointments");
      setAppointments(appRes.data.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------- Handlers ----------
  const toggleDay = (day) => {
    if (!editing) return;
    setSchedule((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const saveSchedule = async () => {
    try {
      setSaving(true);
      // ✅ Correct endpoint with /doctors prefix
      await api.put("/doctors/my-schedules", schedule);
      toast.success("Schedule updated successfully");
      setEditing(false);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  // ---------- UI ----------
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5" /> My Schedule
        </h1>

        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={saveSchedule}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-1 hover:bg-blue-700"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-1 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Working Days */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Working Days</h2>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <button
              key={d.id}
              onClick={() => toggleDay(d.id)}
              disabled={!editing}
              className={`py-2 rounded border text-sm font-medium transition ${
                schedule.workingDays.includes(d.id)
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium mb-1 block">Start Time</label>
          <TimePicker
            value={schedule.workingHours.from}
            disabled={!editing}
            onChange={(v) =>
              setSchedule((prev) => ({
                ...prev,
                workingHours: { ...prev.workingHours, from: v },
              }))
            }
          />
        </div>

        <div>
          <label className="font-medium mb-1 block">End Time</label>
          <TimePicker
            value={schedule.workingHours.to}
            disabled={!editing}
            onChange={(v) =>
              setSchedule((prev) => ({
                ...prev,
                workingHours: { ...prev.workingHours, to: v },
              }))
            }
          />
        </div>
      </div>

      {/* Slot Duration */}
      <div className="bg-white p-4 rounded shadow">
        <label className="font-medium mb-2 block">Slot Duration</label>
        <div className="flex gap-2 flex-wrap">
          {[15, 30, 45, 60].map((d) => (
            <button
              key={d}
              disabled={!editing}
              onClick={() =>
                setSchedule((prev) => ({ ...prev, slotDuration: d }))
              }
              className={`px-3 py-2 rounded border text-sm font-medium transition ${
                schedule.slotDuration === d
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Today's Appointments
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments today</p>
        ) : (
          <div className="space-y-2">
            {appointments.slice(0, 3).map((a) => (
              <div
                key={a._id}
                className="flex justify-between items-center border p-3 rounded hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium flex items-center gap-1 text-gray-800">
                    <User className="w-4 h-4" /> {a.patient?.name || "Patient"}
                  </p>
                  <p className="text-sm text-gray-500">{a.timeSlot}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${
                    a.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : a.status === "ACCEPTED" || a.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded border">
        <h3 className="font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Summary
        </h3>
        <p className="text-sm mt-1">
          Working {schedule.workingDays.length} days,{" "}
          {schedule.workingHours.from} - {schedule.workingHours.to},{" "}
          {schedule.slotDuration} min slots
        </p>
      </div>
    </div>
  );
}
