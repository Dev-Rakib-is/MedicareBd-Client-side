import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Users, CalendarCheck, DollarSign,
  PlusCircle, CheckCircle2, Bell, X,
  GraduationCap, Clock, Star, Calendar
} from "lucide-react";
import api from "../../api/api";
import { motion } from "motion/react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, totalRevenue: 0 });
  const [allDoctors, setAllDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [specializations, setSpecializations] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", password: "", specialization: "", registrationNumber: "",
    qualification: "", fee: "", workingDays: [], workingHours: { from: "", to: "" },
    slotDuration: 30, isFeatured: false, featuredUntil: "", experience: "",
    chamber: "", photo: null, termsAccepted: false
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [notification, setNotification] = useState({ recipientRole: "doctor", type: "push", message: "" });

  const DAYS = [
    { label: "Sun", value: "SUN" }, { label: "Mon", value: "MON" },
    { label: "Tue", value: "TUE" }, { label: "Wed", value: "WED" },
    { label: "Thu", value: "THU" }, { label: "Fri", value: "FRI" },
    { label: "Sat", value: "SAT" }
  ];

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, doctorsRes, pendingRes, specsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/doctors/admin/all"),
        api.get("/doctors/admin/pending-count"),
        api.get("/specializations")
      ]);
      setStats(statsRes.data);
      if (doctorsRes.data?.success) setAllDoctors(doctorsRes.data.doctors || []);
      setPendingCount(pendingRes.data?.pendingCount || 0);
      setSpecializations(Array.isArray(specsRes.data?.data) ? specsRes.data.data : []);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        alert("Session expired. Please login again.");
        navigate("/login");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm(prev => ({ ...prev, photo: files[0] }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const submitDoctor = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!form.termsAccepted || form.workingDays.length === 0 || !form.workingHours.from || !form.workingHours.to) {
      return setMessage({ type: "error", text: "Fill all required fields" });
    }
    try {
      setLoading(true);
      const formDataObj = new FormData();
      Object.keys(form).forEach(key => {
        if (key === "workingDays" || key === "workingHours") {
          formDataObj.append(key, JSON.stringify(form[key]));
        } else if (key === "photo" && form[key]) {
          formDataObj.append(key, form[key]);
        } else if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
          formDataObj.append(key, form[key]);
        }
      });
      await api.post("/doctors/admin/create-doctor", formDataObj, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage({ type: "success", text: "Doctor created successfully!" });
      setForm({
        name: "", email: "", password: "", specialization: "", registrationNumber: "",
        qualification: "", fee: "", workingDays: [], workingHours: { from: "", to: "" },
        slotDuration: 30, isFeatured: false, featuredUntil: "", experience: "",
        chamber: "", photo: null, termsAccepted: false
      });
      setPreview(null);
      loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Creation failed" });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingList = async () => {
    const res = await api.get("/doctors/admin/all?status=PENDING");
    setPendingDoctors(Array.isArray(res.data?.doctors) ? res.data.doctors : []);
  };

  const approveDoctor = async (id) => {
    try {
      await api.patch(`/doctors/admin/approve/${id}`);
      loadData();
      fetchPendingList();
    } catch { alert("Approve failed"); }
  };

  const sendNotification = async () => {
    if (!notification.message) return alert("Enter a message");
    try {
      await api.post("/notifications", notification);
      alert("Notification sent");
      setNotification({ recipientRole: "doctor", type: "push", message: "" });
      setModal(null);
    } catch { alert("Notification failed"); }
  };

  const statsCards = [
    { icon: Users, label: "Total Doctors", value: allDoctors.length, color: "blue" },
    { icon: User, label: "Total Patients", value: stats.totalPatients, color: "green" },
    { icon: CalendarCheck, label: "Appointments", value: stats.totalAppointments, color: "purple" },
    { icon: DollarSign, label: "Revenue", value: `$${stats.totalRevenue}`, color: "yellow" }
  ];

  const modalContent = () => {
    switch (modal) {
      case "addDoctor":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Add Doctor</h2>
            {message.text && (
              <div className={`p-3 mb-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {message.type === "success" ? "✅" : "⚠️"} {message.text}
              </div>
            )}
            <form onSubmit={submitDoctor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["name", "email", "password", "specialization"].map((field, idx) => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
                    {field === "specialization" ? (
                      <select name={field} value={form[field]} onChange={handleFormChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <option value="">Select Specialization</option>
                        {specializations.map(spec => <option key={spec._id} value={spec._id}>{spec.name}</option>)}
                      </select>
                    ) : (
                      <input type={field === "password" ? "password" : field === "email" ? "email" : "text"} name={field} value={form[field]} onChange={handleFormChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["registrationNumber", "qualification", "fee", "experience"].map(field => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-medium flex items-center gap-1">
                      {field === "qualification" && <GraduationCap className="w-4 h-4" />}
                      {field.charAt(0).toUpperCase() + field.slice(1)} {field !== "experience" && "*"}
                    </label>
                    <input type={field === "fee" ? "number" : "text"} name={field} value={form[field]} onChange={handleFormChange} required={field !== "experience"} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Chamber/Hospital</label>
                <input type="text" name="chamber" value={form.chamber} onChange={handleFormChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div>
                <label className="block mb-2 font-medium">Working Days *</label>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS.map(day => (
                    <button type="button" key={day.value} onClick={() => toggleDay(day.value)} className={`p-2 text-sm rounded-lg border ${form.workingDays.includes(day.value) ? "bg-blue-600 text-white border-blue-600" : "bg-gray-100 dark:bg-gray-700"}`}>
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium">Working Hours *</label>
                <div className="grid grid-cols-2 gap-4">
                  {["from", "to"].map(time => (
                    <div key={time}>
                      <label className="block text-sm mb-1">{time.charAt(0).toUpperCase() + time.slice(1)}</label>
                      <input type="time" name={`workingHours.${time}`} value={form.workingHours[time]} onChange={handleFormChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium flex items-center gap-2"><Clock className="w-4 h-4" />Appointment Duration *</label>
                <select name="slotDuration" value={form.slotDuration} onChange={handleFormChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                  {[15, 20, 30, 45, 60].map(min => <option key={min} value={min}>{min} minutes</option>)}
                </select>
              </div>
              <div className="p-4 border rounded-lg dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2"><Star className="w-4 h-4 text-yellow-500" /><label className="font-medium">Featured Doctor</label></div>
                <div className="flex items-center">
                  <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleFormChange} className="w-4 h-4" />
                  <label htmlFor="isFeatured" className="ml-2 text-sm">Mark as Featured</label>
                </div>
                {form.isFeatured && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1"><Calendar className="w-4 h-4 inline" /> Featured Until</label>
                    <input type="date" name="featuredUntil" value={form.featuredUntil} onChange={handleFormChange} className="w-full p-2 border rounded" />
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium">Profile Photo</label>
                <input type="file" accept="image/*" onChange={handleFormChange} className="w-full p-2 border rounded-lg" />
                {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border mt-2" />}
              </div>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input type="checkbox" id="termsAccepted" name="termsAccepted" checked={form.termsAccepted} onChange={handleFormChange} className="mr-3 w-4 h-4" required />
                <label htmlFor="termsAccepted" className="text-sm">I accept Terms & Conditions *</label>
              </div>
              <button type="submit" disabled={loading} className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                {loading ? "Creating..." : "Create Doctor"}
              </button>
            </form>
          </div>
        );
      case "approveDoctor":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Pending Doctors</h2>
            {pendingDoctors.length === 0 ? <p className="text-gray-500 text-center py-4">No pending doctors.</p> : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pendingDoctors.map(doc => (
                  <div key={doc._id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.email}</p>
                    </div>
                    <button onClick={() => approveDoctor(doc._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "sendNotification":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Send Notification</h2>
            <div className="space-y-4">
              <textarea value={notification.message} onChange={e => setNotification({ ...notification, message: e.target.value })} placeholder="Enter message" className="w-full p-3 border rounded-lg" rows="4" />
              <div className="grid grid-cols-2 gap-4">
                <select value={notification.recipientRole} onChange={e => setNotification({ ...notification, recipientRole: e.target.value })} className="w-full p-3 border rounded-lg">
                  <option value="doctor">Doctors</option>
                  <option value="patient">Patients</option>
                  <option value="all">All</option>
                </select>
                <select value={notification.type} onChange={e => setNotification({ ...notification, type: e.target.value })} className="w-full p-3 border rounded-lg">
                  <option value="push">Push</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <button onClick={sendNotification} className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Send</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statsCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
            <card.icon className={`w-10 h-10 text-${card.color}-500`} />
            <div>
              <p className="text-gray-500 dark:text-gray-300 text-sm">{card.label}</p>
              <p className="text-xl font-semibold dark:text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <button onClick={() => setModal("addDoctor")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusCircle className="w-5 h-5" /> Add Doctor
        </button>
        <button onClick={() => { setModal("approveDoctor"); fetchPendingList(); }} className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <CheckCircle2 className="w-5 h-5" /> Approve Doctor
          {pendingCount > 0 && <span className="ml-2 w-6 h-6 flex items-center justify-center bg-red-500 rounded-full text-sm">{pendingCount}</span>}
        </button>
        <button onClick={() => setModal("sendNotification")} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          <Bell className="w-5 h-5" /> Send Notification
        </button>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
            {modalContent()}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;