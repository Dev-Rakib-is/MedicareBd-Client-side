import { useEffect, useState } from "react";
import api from "../api/api";
import { motion } from 'motion/react';

const NotificationSettings = () => {
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [push, setPush] = useState(true);

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch notifications
  const fetchNotification = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  // Save user notification preferences
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.patch("/auth/me", {
        notificationSettings: {
          email,
          sms,
          push,
        },
      });

      setSuccess("Settings updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };
  // Clear Notification 
  useEffect(()=>{
    if (success || error ) {
      const timer = setTimeout(()=>{
        setError("");
        setSuccess("")
      },5000)
      return () => clearTimeout(timer)
    }
  },[success,error])

  return (
    <div className="p-6 w-full max-w-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Notification Settings</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
        {/* Appointment Alerts */}
        <div>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-500">Appointment Alerts</h3>

          <ToggleRow
            label="Appointment Confirmation"
            checked={email}
            onChange={() => setEmail(!email)}
          />

          <ToggleRow
            label="Appointment Reminder"
            checked={sms}
            onChange={() => setSms(!sms)}
          />
        </div>

        {/* Communication */}
        <div>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-500">Communication</h3>

          <ToggleRow
            label="New Message from Doctor"
            checked={push}
            onChange={() => setPush(!push)}
          />
        </div>

        {/* Delivery Channels */}
        <div>
          <h3 className="text-lg font-semibold mb-2 dark:text-gray-500">Delivery Preferences</h3>

          <ToggleRow
            label="Email Notifications"
            checked={email}
            onChange={() => setEmail(!email)}
          />
          <ToggleRow
            label="SMS Alerts"
            checked={sms}
            onChange={() => setSms(!sms)}
          />
          <ToggleRow
            label="Push Notifications"
            checked={push}
            onChange={() => setPush(!push)}
          />
        </div>
        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`mt-4 transition text-white px-5 py-2 rounded-lg font-medium ${
            loading
              ? " bg-green-300 cursor-not-allowed"
              : " bg-green-600 cursor-pointer"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {/* Messages */}
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
};

const ToggleRow = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-gray-800 dark:text-gray-200">{label}</span>

    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div
        className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer 
          peer-checked:bg-green-600 transition-all"
      ></div>

      <div
        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"
      ></div>
    </label>
  </div>
);

export default NotificationSettings;
