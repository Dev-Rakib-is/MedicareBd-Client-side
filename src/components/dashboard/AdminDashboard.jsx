import { useState, useEffect } from "react";
import {
  User, Users, CalendarCheck, DollarSign, PlusCircle,
  CheckCircle2, Bell, X
} from "lucide-react";
import api from "../../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });
  

  const [allDoctors, setAllDoctors] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [pendingDoctorsCount, setPendingDoctorsCount] = useState(0);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [modalType, setModalType] = useState(null);

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    photo_url: "",
    qualification: "",
    experience: 0,
    chamber: "",
    visitingHours: "",
    fee: 0,
    available_slots: []
  });

  const [notification, setNotification] = useState({
    recipientRole: "doctor",
    type: "push",
    message: ""
  });

  useEffect(() => {
    fetchStats();
    fetchAllDoctors();
    fetchRecentAppointments();
    fetchPendingDoctorsCount();
    fetchSpecializations();
  }, []);

  // ---------------- Fetch APIs ----------------
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log("Error fetching stats:", err);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const res = await api.get("/doctors/admin/all");
      if (res.data?.success) setAllDoctors(res.data.allDoctors || []);
    } catch (err) {
      console.log("Error fetching all doctors:", err);
      setAllDoctors([]);
    }
  };

  const fetchRecentAppointments = async () => {
    try {
      const res = await api.get("/admin/recent-appointments");
      setRecentAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Error fetching appointments:", err);
      setRecentAppointments([]);
    }
  };

  const fetchPendingDoctorsCount = async () => {
    try {
      const res = await api.get("/doctors/admin/status/pending-count");
      setPendingDoctorsCount(res.data.pendingCount || 0);
    } catch (err) {
      console.log("Error fetching pending count:", err);
      setPendingDoctorsCount(0);
    }
  };

  const fetchPendingDoctorsList = async () => {
    try {
      const res = await api.get("/doctors/admin/status/pending");
      setPendingDoctors(Array.isArray(res.data.doctors) ? res.data.doctors : []);
    } catch (err) {
      console.log("Error fetching pending doctors:", err);
      setPendingDoctors([]);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await api.get("/specializations");
      setSpecializations(res.data || []);
    } catch (err) {
      console.error("Error fetching specializations:", err);
      setSpecializations([]);
    }
  };

  // ---------------- Actions ----------------
  const handleAddDoctor = async () => {
    try {
      if (!newDoctor.name) return alert("Name is required");
      if (!newDoctor.specialization) return alert("Specialization is required");

      const res = await api.post("/doctors", newDoctor);
      alert(res.data.message || "Doctor added successfully");

      setNewDoctor({
        name: "",
        specialization: "",
        photo_url: "",
        qualification: "",
        experience: 0,
        chamber: "",
        visitingHours: "",
        fee: 0,
        available_slots: []
      });

      setModalType(null);
      fetchStats();
      fetchPendingDoctorsCount();
      fetchAllDoctors();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error adding doctor");
    }
  };

  const handleApproveDoctor = async (id) => {
    try {
      await api.patch(`/doctors/admin/approve/${id}`);
      alert("Doctor approved successfully");
      fetchPendingDoctorsList();
      fetchPendingDoctorsCount();
      fetchAllDoctors();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error approving doctor");
    }
  };

  const handleSendNotification = async () => {
    try {
      const res = await api.post("/notifications", notification);
      alert("Notification sent successfully!");
      setNotification({ recipientRole: "doctor", type: "push", message: "" });
      setModalType(null);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error sending notification");
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto space-y-6 mt-16">
      <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
          <Users className="w-10 h-10 text-blue-500"/>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Total Doctors</p>
            <p className="text-xl font-semibold dark:text-white">{allDoctors.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
          <User className="w-10 h-10 text-green-500"/>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Total Patients</p>
            <p className="text-xl font-semibold dark:text-white">{stats.totalPatients}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
          <CalendarCheck className="w-10 h-10 text-purple-500"/>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Appointments</p>
            <p className="text-xl font-semibold dark:text-white">{stats.totalAppointments}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow flex items-center gap-4">
          <DollarSign className="w-10 h-10 text-yellow-500"/>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Revenue</p>
            <p className="text-xl font-semibold dark:text-white">${stats.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 items-center">
        <button onClick={() => setModalType("addDoctor")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">
          <PlusCircle className="w-5 h-5"/> Add Doctor
        </button>

        <button onClick={() => { setModalType("approveDoctor"); fetchPendingDoctorsList(); }} className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition">
          <CheckCircle2 className="w-5 h-5"/> Approve Doctor
          {pendingDoctorsCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-white bg-red-500 rounded-full">
              {pendingDoctorsCount}
            </span>
          )}
        </button>

        <button onClick={() => setModalType("sendNotification")} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition">
          <Bell className="w-5 h-5"/> Send Notification
        </button>
      </div>

      {/* ---------------- Modals ---------------- */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg relative">
            <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6"/>
            </button>

            {/* Add Doctor Modal */}
            {modalType === "addDoctor" && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold dark:text-white">Add Doctor</h2>
                <input type="text" placeholder="Name" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} className="p-2 rounded w-full"/>
                
                <select value={newDoctor.specialization} onChange={e => setNewDoctor({...newDoctor, specialization: e.target.value})} className="p-2 rounded w-full">
                  <option value="">Select Specialization</option>
                  {specializations.map(spec => (
                    <option key={spec._id} value={spec.name}>{spec.name}</option>
                  ))}
                </select>

                <input type="text" placeholder="Photo URL" value={newDoctor.photo_url} onChange={e => setNewDoctor({...newDoctor, photo_url: e.target.value})} className="p-2 rounded w-full"/>
                <input type="text" placeholder="Qualification" value={newDoctor.qualification} onChange={e => setNewDoctor({...newDoctor, qualification: e.target.value})} className="p-2 rounded w-full"/>
                <input type="number" placeholder="Experience" value={newDoctor.experience} onChange={e => setNewDoctor({...newDoctor, experience: Number(e.target.value)})} className="p-2 rounded w-full"/>
                <input type="text" placeholder="Chamber" value={newDoctor.chamber} onChange={e => setNewDoctor({...newDoctor, chamber: e.target.value})} className="p-2 rounded w-full"/>
                <input type="text" placeholder="Visiting Hours" value={newDoctor.visitingHours} onChange={e => setNewDoctor({...newDoctor, visitingHours: e.target.value})} className="p-2 rounded w-full"/>
                <input type="number" placeholder="Fee" value={newDoctor.fee} onChange={e => setNewDoctor({...newDoctor, fee: Number(e.target.value)})} className="p-2 rounded w-full"/>
                
                <button onClick={handleAddDoctor} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 w-full">Add Doctor</button>
              </div>
            )}

            {/* Approve Doctor Modal */}
            {modalType === "approveDoctor" && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold dark:text-white">Pending Doctors</h2>
                {pendingDoctors.length === 0 && <p className="dark:text-white">No pending doctors</p>}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {pendingDoctors.map(doc => (
                    <div key={doc._id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <span className="dark:text-white">{doc.name}</span>
                      <button onClick={() => handleApproveDoctor(doc._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500">Approve</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Send Notification Modal */}
            {modalType === "sendNotification" && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold dark:text-white">Send Notification</h2>
                <select value={notification.recipientRole} onChange={e => setNotification({...notification, recipientRole: e.target.value})} className="p-2 rounded w-full">
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
                <select value={notification.type} onChange={e => setNotification({...notification, type: e.target.value})} className="p-2 rounded w-full">
                  <option value="push">Push</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
                <input type="text" placeholder="Message" value={notification.message} onChange={e => setNotification({...notification, message: e.target.value})} className="p-2 rounded w-full"/>
                <button onClick={handleSendNotification} className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400 w-full">Send</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Appointments */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Appointments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="py-2 px-4">Patient</th>
                <th className="py-2 px-4">Doctor</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length > 0 ? recentAppointments.map((a, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-4">{a.patientName}</td>
                  <td className="py-2 px-4">{a.doctorName}</td>
                  <td className="py-2 px-4">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{a.status}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
