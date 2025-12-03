import { useEffect, useState } from "react";
import api from "../api/api";
import Darkmode from "../components/ui/Darkmode";
import { useFontSize } from "../contex/FontContext";

const PreferenceSettings = () => {
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("Public");
  const [autoLogout, setAutoLogout] = useState("Never");
  const [loading, setLoading] = useState(false); 
  const [loadingPreferences, setLoadingPreferences] = useState(true); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { fontSize, setFontSize, fontSizeClass } = useFontSize();

  // Fetch Preferences
  const fetchPreference = async () => {
    try {
      setLoadingPreferences(true);
      const res = await api.get("/preferences");
      const pref = res.data?.preferences || {};

      setLanguage(pref.language ?? "English");
      setNotifications(pref.notifications ?? true);

      // Normalize fontSize
      const fetchedFont = pref.fontSize;
      const normalizedFont = ["Small", "Medium", "Large"].includes(fetchedFont)
        ? fetchedFont
        : "Medium";
      setFontSize(normalizedFont);

      setProfileVisibility(pref.profileVisibility ?? "Public");
      setAutoLogout(pref.autoLogout ?? "Never");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load preferences");
    } finally {
      setLoadingPreferences(false);
    }
  };

  useEffect(() => {
    fetchPreference();
  }, []);

  // Save Preferences
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.patch("/preferences", {
        preferences: {
          language,
          notifications,
          fontSize,
          profileVisibility,
          autoLogout,
        },
      });

      setSuccess("Preferences updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  // Auto clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);


  if (loadingPreferences) {
  return (
    <div className="p-6 w-full max-w-lg animate-pulse">
      <h2 className="h-8 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-6"></h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
        {/* Skeleton rows */}
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded mt-4"></div> 
      </div>
    </div>
  );
}


  return (
    <div className="p-6 w-full max-w-lg">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">
        Preferences
      </h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
        {/* Language */}
        <SettingItem label="Language">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-white outline-none"
          >
            <option value="English">English</option>
            <option value="Bangla">Bangla</option>
            <option value="Hindi">Hindi</option>
            <option value="Arabic">Arabic</option>
            <option value="Chinese">Chinese</option>
            <option value="Spanish">Spanish</option>
          </select>
        </SettingItem>

        {/* DarkMode */}
        <SettingItem label="Darkmode">
          <Darkmode />
        </SettingItem>

        {/* Notifications */}
        <SettingItem label="Notifications">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-5 h-5 accent-green-600"
          />
        </SettingItem>

        {/* Font Size */}
        <SettingItem label="Font Size">
          <select
            value={fontSize || "Medium"}
            onChange={(e) => setFontSize(e.target.value)}
            className={`border px-3 py-2 rounded dark:bg-gray-700 dark:text-white outline-none ${fontSize ? fontSizeClass[fontSize] : ""}`}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </SettingItem>

        {/* Profile Visibility */}
        <SettingItem label="Profile Visibility">
          <select
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
            className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-white outline-none"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Only Me">Only Me</option>
          </select>
        </SettingItem>

        {/* Auto Logout */}
        <SettingItem label="Auto Logout Timer">
          <select
            value={autoLogout}
            onChange={(e) => setAutoLogout(e.target.value)}
            className="border px-3 py-2 rounded dark:bg-gray-700 dark:text-white outline-none"
          >
            <option value="5 minutes">5 minutes</option>
            <option value="15 minutes">15 minutes</option>
            <option value="30 minutes">30 minutes</option>
            <option value="Never">Never</option>
          </select>
        </SettingItem>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full mt-4 transition text-white px-4 py-3 rounded-lg font-medium ${
            loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 cursor-pointer"
          }`}
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>
    </div>
  );
};

// Reusable Setting Item
const SettingItem = ({ label, children }) => (
  <div className="flex items-center justify-between">
    <span className="font-medium dark:text-white">{label}</span>
    {children}
  </div>
);

export default PreferenceSettings;
