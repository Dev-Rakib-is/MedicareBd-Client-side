import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Users,
  CalendarCheck,
  DollarSign,
  PlusCircle,
  CheckCircle2,
  Bell,
  X,
  GraduationCap,
} from "lucide-react";
import api from "../../api/api";
import { motion } from "motion/react";

const DAYS = [
  { label: "Sun", value: "SUN" },
  { label: "Mon", value: "MON" },
  { label: "Tue", value: "TUE" },
  { label: "Wed", value: "WED" },
  { label: "Thu", value: "THU" },
  { label: "Fri", value: "FRI" },
  { label: "Sat", value: "SAT" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });

  const [allDoctors, setAllDoctors] = useState([]);
  const [pendingDoctorsCount, setPendingDoctorsCount] = useState(0);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [modalType, setModalType] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    registrationNumber: "",
    qualification: "",
    fee: "",
    workingDays: [],
    workingHours: { from: "", to: "" },
    photo: null,
    termsAccepted: false,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [notification, setNotification] = useState({
    recipientRole: "doctor",
    type: "push",
    message: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      await Promise.all([
        fetchStats(),
        fetchAllDoctors(),
        fetchPendingDoctorsCount(),
        fetchSpecializations(),
      ]);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        alert("Session expired. Please login again.");
        navigate("/login");
      }
    }
  };

  const fetchStats = async () => {
    const res = await api.get("/admin/stats");
    setStats(res.data);
  };

  const fetchAllDoctors = async () => {
    const res = await api.get("/doctors/admin/all");
    if (res.data?.success) setAllDoctors(res.data.doctors || []);
  };

  const fetchPendingDoctorsCount = async () => {
    const res = await api.get("/doctors/admin/pending-count");
    setPendingDoctorsCount(res.data?.pendingCount || 0);
  };

  const fetchPendingDoctorsList = async () => {
    const res = await api.get("/doctors/admin/all?status=PENDING");
    setPendingDoctors(Array.isArray(res.data?.doctors) ? res.data.doctors : []);
  };

  const fetchSpecializations = async () => {
    try {
      const res = await api.get("/specializations");
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setSpecializations(data);
    } catch (err) {
      console.error("Failed to fetch specializations:", err);
      setSpecializations([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, photo: files[0] });
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (name.includes("workingHours.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        workingHours: { ...formData.workingHours, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const newDays = prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day];
      return { ...prev, workingDays: newDays };
    });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

     console.log("Registration Number:", formData.registrationNumber);
  console.log("FormData before submission:", formData);

    // Validation
    if (!formData.termsAccepted) {
      return setError("You must accept the Terms & Conditions");
    }
    if (formData.workingDays.length === 0) {
      return setError("Please select at least one working day");
    }
    if (!formData.workingHours.from || !formData.workingHours.to) {
      return setError("Please select working hours");
    }
    if (!formData.registrationNumber || formData.registrationNumber.trim() === "") {
      return setError("Registration number is required");
    }
    if (!formData.qualification || formData.qualification.trim() === "") {
      return setError("Qualification is required");
    }

    try {
      setLoading(true);
      
      // Create FormData
      const formDataObj = new FormData();
      
      // Append all fields
      formDataObj.append("name", formData.name.trim());
      formDataObj.append("email", formData.email.trim());
      formDataObj.append("password", formData.password);
      formDataObj.append("specialization", formData.specialization);
      formDataObj.append("registrationNumber", formData.registrationNumber.trim());
      formDataObj.append("qualification", formData.qualification.trim());
      formDataObj.append("fee", formData.fee);
      
      // Append working days
      formData.workingDays.forEach(day => {
        formDataObj.append("workingDays", day);
      });
      
      // Append working hours
      formDataObj.append("workingHours[from]", formData.workingHours.from);
      formDataObj.append("workingHours[to]", formData.workingHours.to);
      
      // Append photo if exists
      if (formData.photo) {
        formDataObj.append("photo", formData.photo);
      }
      
      // Debug: Log what we're sending
      console.log("Sending FormData:");
      for (let [key, value] of formDataObj.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Send request
      const response = await api.post("/doctors/admin/create-doctor", formDataObj, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      
      setSuccess("Doctor registered successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        specialization: "",
        registrationNumber: "",
        qualification: "",
        fee: "",
        workingDays: [],
        workingHours: { from: "", to: "" },
        photo: null,
        termsAccepted: false,
      });
      setPreview(null);
      setModalType(null);
      
      // Refresh data
      await loadAll();
      
    } catch (err) {
      console.error("Registration error:", err.response?.data || err);
      
      // Check for specific error messages
      if (err.response?.data?.error) {
        if (typeof err.response.data.error === 'string') {
          setError(err.response.data.error);
        } else if (err.response.data.error.message) {
          setError(err.response.data.error.message);
        } else {
          setError(JSON.stringify(err.response.data.error));
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDoctor = async (id) => {
    try {
      await api.patch(`/doctors/admin/approve/${id}`);
      fetchPendingDoctorsList();
      fetchPendingDoctorsCount();
      loadAll();
    } catch {
      alert("Approve failed");
    }
  };

  const handleSendNotification = async () => {
    if (!notification.message) return alert("Enter a message");
    try {
      await api.post("/notifications", notification);
      alert("Notification sent");
      setNotification({ recipientRole: "doctor", type: "push", message: "" });
      setModalType(null);
    } catch {
      alert("Notification failed");
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
          <Users className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Total Doctors
            </p>
            <p className="text-xl font-semibold dark:text-white">
              {allDoctors.length}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
          <User className="w-10 h-10 text-green-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Total Patients
            </p>
            <p className="text-xl font-semibold dark:text-white">
              {stats.totalPatients}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
          <CalendarCheck className="w-10 h-10 text-purple-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              Appointments
            </p>
            <p className="text-xl font-semibold dark:text-white">
              {stats.totalAppointments}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
          <DollarSign className="w-10 h-10 text-yellow-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Revenue</p>
            <p className="text-xl font-semibold dark:text-white">
              ${stats.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={() => setModalType("addDoctor")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" /> Add Doctor
        </button>
        <button
          onClick={() => {
            setModalType("approveDoctor");
            fetchPendingDoctorsList();
          }}
          className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <CheckCircle2 className="w-5 h-5" /> Approve Doctor
          {pendingDoctorsCount > 0 && (
            <span className="ml-2 w-6 h-6 flex items-center justify-center bg-red-500 rounded-full text-sm">
              {pendingDoctorsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setModalType("sendNotification")}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          <Bell className="w-5 h-5" /> Send Notification
        </button>
      </div>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Add Doctor Modal */}
            {modalType === "addDoctor" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Add Doctor</h2>
                
                {success && (
                  <div className="p-3 mb-4 bg-green-100 text-green-800 rounded-lg">
                    ✅ {success}
                  </div>
                )}
                
                {error && (
                  <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-lg">
                    ⚠️ {error}
                  </div>
                )}
                
                <form onSubmit={handleAddDoctor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Dr. John Doe"
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="doctor@example.com"
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        minLength="6"
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Specialization *
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="">Select Specialization</option>
                        {specializations.map((spec) => (
                          <option key={spec._id} value={spec._id}>
                            {spec.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="MED123456"
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        Qualification *
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="MBBS, MD, PhD, etc."
                        required
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Consultation Fee (USD) *
                      </label>
                      <input
                        type="number"
                        name="fee"
                        value={formData.fee}
                        onChange={handleChange}
                        placeholder="50"
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">
                      Working Days *
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {DAYS.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`p-2 text-sm rounded-lg border transition ${
                            formData.workingDays.includes(day.value)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {formData.workingDays.length} days - {formData.workingDays.join(", ")}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">
                      Working Hours *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">From *</label>
                        <input
                          type="time"
                          name="workingHours.from"
                          value={formData.workingHours.from}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">To *</label>
                        <input
                          type="time"
                          name="workingHours.to"
                          value={formData.workingHours.to}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                    {preview && (
                      <div className="mt-2">
                        <p className="text-sm mb-1">Preview:</p>
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded-lg border" 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4"
                      required
                    />
                    <label htmlFor="termsAccepted" className="text-sm">
                      I confirm that all information provided is accurate and I accept the Terms & Conditions *
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-3 rounded-lg font-medium transition ${
                      loading 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-green-600 hover:bg-green-700"
                    } text-white`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </span>
                    ) : "Register Doctor"}
                  </button>
                </form>
              </div>
            )}

            {/* Approve Doctor Modal */}
            {modalType === "approveDoctor" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Pending Doctors</h2>
                {pendingDoctors.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No pending doctors for approval.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pendingDoctors.map((doc) => (
                      <div
                        key={doc._id}
                        className="flex justify-between items-center p-4 border rounded-lg dark:border-gray-600"
                      >
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.email}</p>
                          <p className="text-sm text-gray-500">
                            Qualification: {doc.qualification || "Not specified"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Registration: {doc.registrationNumber || "Not specified"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleApproveDoctor(doc._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Send Notification Modal */}
            {modalType === "sendNotification" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Send Notification</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Message *
                    </label>
                    <textarea
                      value={notification.message}
                      onChange={(e) =>
                        setNotification({
                          ...notification,
                          message: e.target.value,
                        })
                      }
                      placeholder="Enter notification message"
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      rows="4"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Recipient
                      </label>
                      <select
                        value={notification.recipientRole}
                        onChange={(e) =>
                          setNotification({
                            ...notification,
                            recipientRole: e.target.value,
                          })
                        }
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="doctor">Doctors</option>
                        <option value="patient">Patients</option>
                        <option value="all">All Users</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Type
                      </label>
                      <select
                        value={notification.type}
                        onChange={(e) =>
                          setNotification({
                            ...notification,
                            type: e.target.value,
                          })
                        }
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="push">Push Notification</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendNotification}
                    className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Send Notification
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;