import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/api";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // show/hide toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // password strength
  const [strength, setStrength] = useState("");

  useEffect(() => {
    if (!newPassword) {
      setStrength("");
      return;
    }
    if (newPassword.length < 6) setStrength("Weak");
    else if (newPassword.length < 10) setStrength("Medium");
    else setStrength("Strong");
  }, [newPassword]);

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const validateForm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      displayMessage("All fields are required");
      return false;
    }
    if (newPassword !== confirmPassword) {
      displayMessage("New password and confirm password do not match!");
      return false;
    }
    if (newPassword.length < 6) {
      displayMessage("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handlePasswordUpdate = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await api.post("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      if (res.status === 200) {
        displayMessage("Password updated successfully! Please re-login.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      displayMessage(err.response?.data?.message || "Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 dark:bg-black">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Security Settings</h2>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-xl">
        {/* CURRENT PASSWORD */}
        <label className="block font-medium mb-1 dark:text-white">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className="w-full p-2 border rounded dark:bg-gray-700 pr-10 outline-0 dark:placeholder:text-white text-black dark:text-white"
          />
          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <EyeOff size={20} className="iconColor"/> : <Eye size={20}  className="iconColor"/>}
          </span>
        </div>

        {/* NEW PASSWORD */}
        <label className="block font-medium mt-4 mb-1 dark:text-white">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-2 border rounded dark:bg-gray-700 pr-10 dark:placeholder:text-white outline-0 text-black dark:text-white"
          />
          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff size={20} className="iconColor"/> : <Eye size={20} className="iconColor"/>}
          </span>
        </div>

        {/* STRENGTH METER */}
        {strength && (
          <p
            className={`mt-1 text-sm font-semibold ${
              strength === "Weak"
                ? "text-red-500"
                : strength === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            Strength: {strength}
          </p>
        )}

        {/* CONFIRM PASSWORD */}
        <label className="block font-medium mt-4 mb-1 dark:text-white">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded dark:bg-gray-700 pr-10 dark:placeholder:text-white outline-0 text-black dark:text-white"
          />
          <span
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} className="iconColor"/> : <Eye size={20} className="iconColor"/>}
          </span>
        </div>

        {/* UPDATE BUTTON */}
        <button
          onClick={handlePasswordUpdate}
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded text-white w-full ${
            loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600"
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {/* MESSAGE */}
        {message && <p className="mt-3 text-center font-medium text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default SecuritySettings;
