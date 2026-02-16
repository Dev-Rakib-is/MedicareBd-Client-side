import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contex/AuthContex";

const AccountSettings = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [userPhoto, setUserPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch user info
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      const u = res.data.user;
      setName(u.name || "");
      setUsername(u.username || "");
      setBio(u.bio || "");
      setGender(u.gender || "");
      setDob(u.dob || "");
      setLocation(u.location || "");
      setInterests(u.interests || "");
      setEmail(u.email || "");
      setPhone(u.phone || "");
      setUserPhoto(u.photo_url || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Auto hide messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Handle profile update
  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("gender", gender);
      formData.append("dob", dob);
      formData.append("location", location);
      formData.append("interests", interests);
      formData.append("email", email);
      formData.append("phone", phone);
      if (photo) formData.append("photo", photo); 

      const res = await api.patch("/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUserPhoto(res.data.user.photo_url); 
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await api.delete("/users/me");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-xl">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        Account Settings
      </h2>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-5">
        {/* Profile Picture */}
        <div className="flex items-center gap-5">
          <img
            src={photo ? URL.createObjectURL(photo) : userPhoto || "/default-avatar.png"}
            alt="profile avatar"
            className="w-20 h-20 rounded-full object-cover border border-gray-400 dark:border-white/40"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition"
          />
        </div>

        {/* Form Fields */}
        <div>
          <label className="block font-medium mb-1 dark:text-white">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
            placeholder="Username"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-white">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
            placeholder="Write something about yourself"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-white">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-white">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-white">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-white">Interests / Specialization</label>
          <input
            type="text"
            value={interests || ""}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
            placeholder="e.g., Cardiology, Fitness, Yoga"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-white">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
            placeholder="Email"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 dark:text-white">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white outline-none"
            placeholder="Phone"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-500 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* Messages */}
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* Danger Zone */}
      {user.role !== "ADMIN" && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition mt-6 cursor-pointer"
        >
          Delete Account
        </button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px]"
          >
            <div className="w-full max-w-md p-8 rounded-md shadow-2xl border border-black/40 dark:border-white/40 text-center bg-gray-900 dark:bg-gray-900">
              <h2 className="font-semibold text-xl text-white mb-4">Confirm Delete</h2>
              <p className="text-base font-normal mb-5 text-white">
                Are you sure you want to delete your account?
              </p>

              <div className="flex justify-center gap-4">
                <motion.button
                  disabled={loading}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-500 disabled:opacity-70 cursor-pointer"
                >
                  {loading ? "Deleting..." : "Confirm"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-400 cursor-pointer"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountSettings;
