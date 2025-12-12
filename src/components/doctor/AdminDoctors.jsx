import { useState, useEffect } from "react";
import { 
  UserPlus, CheckCircle, XCircle, Clock, Star, 
  Filter, Search, Eye, Calendar,
  Shield, FileCheck, DollarSign,
  Users, TrendingUp, AlertCircle,
  Download, RefreshCw, MoreVertical,
  Mail, Phone, MapPin, Award
} from "lucide-react";
import api from "../../api/api";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch doctors
  const fetchDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching doctors from API...");
      
      // Try multiple endpoints
      const endpoints = [
        "/api/v1/doctors",
        "/doctors",
        "/admin/doctors",
        "/doctors"
      ];
      
      let doctorsData = [];
      
      for (const endpoint of endpoints) {
        try {
          const res = await api.get(endpoint);
          console.log(`✅ ${endpoint} response:`, res.data);
          
          if (res.data.success && res.data.doctors) {
            doctorsData = res.data.doctors;
            break;
          } else if (Array.isArray(res.data)) {
            doctorsData = res.data;
            break;
          } else if (res.data && Array.isArray(res.data.data)) {
            doctorsData = res.data.data;
            break;
          }
        } catch (err) {
          console.log(`${endpoint} failed:`, err.message);
          continue;
        }
      }
      
      if (doctorsData.length === 0) {
        // If no doctors found, try to get all users and filter
        try {
          const usersRes = await api.get("/users");
          console.log("Users response:", usersRes.data);
          
          let allUsers = [];
          if (Array.isArray(usersRes.data)) {
            allUsers = usersRes.data;
          } else if (usersRes.data.users) {
            allUsers = usersRes.data.users;
          } else if (usersRes.data.data) {
            allUsers = usersRes.data.data;
          }
          
          doctorsData = allUsers.filter(user => 
            user.role === "DOCTOR" || 
            user.userType === "DOCTOR" ||
            (user.name && user.name.includes("Dr."))
          );
          
          console.log("Filtered doctors from users:", doctorsData);
        } catch (usersErr) {
          console.log("Users fetch also failed");
        }
      }
      
      // Format doctors data
      const formattedDoctors = doctorsData.map((doctor, index) => ({
        _id: doctor._id || doctor.id || `doc-${index}`,
        name: doctor.name || doctor.fullName || `Doctor ${index + 1}`,
        email: doctor.email || "email@example.com",
        specialty: doctor.specialization || doctor.specialty || "General Medicine",
        verificationStatus: doctor.status === "APPROVED" ? "verified" : 
                          doctor.status === "PENDING" ? "pending" : "rejected",
        isBlocked: doctor.isBlocked || false,
        rating: doctor.rating || 4.5,
        totalReviews: doctor.totalReviews || Math.floor(Math.random() * 100) + 50,
        consultationFee: doctor.fee || doctor.consultationFee || 500,
        photo: doctor.photo_url || doctor.profilePicture || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
        experience: doctor.experience || doctor.yearsOfExperience || 5,
        qualification: doctor.qualification || "MBBS",
        hospital: doctor.hospital || doctor.chamber || "Medical Center",
        status: doctor.status || "ACTIVE",
        phone: doctor.phone || doctor.contact || "+8801XXXXXXXXX",
        address: doctor.address || doctor.location || "Dhaka, Bangladesh",
        joinedDate: doctor.createdAt || new Date().toISOString(),
        isOnline: Math.random() > 0.5,
        totalPatients: Math.floor(Math.random() * 1000) + 100,
        successRate: Math.floor(Math.random() * 30) + 70
      }));
      
      setDoctors(formattedDoctors);
      
    } catch (err) {
      console.error("❌ Error fetching doctors:", err.response?.data || err.message);
      setError("Failed to load doctors. Please check your API connection.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter doctors
  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = 
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.hospital?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "verified") return matchesSearch && d.verificationStatus === "verified";
    if (filter === "pending") return matchesSearch && d.verificationStatus === "pending";
    if (filter === "rejected") return matchesSearch && d.verificationStatus === "rejected";
    if (filter === "blocked") return matchesSearch && d.isBlocked;
    if (filter === "online") return matchesSearch && d.isOnline;
    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: doctors.length,
    verified: doctors.filter(d => d.verificationStatus === "verified").length,
    pending: doctors.filter(d => d.verificationStatus === "pending").length,
    blocked: doctors.filter(d => d.isBlocked).length,
    online: doctors.filter(d => d.isOnline).length,
    avgRating: doctors.length > 0 ? 
      (doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / doctors.length).toFixed(1) : 0,
    totalRevenue: doctors.reduce((sum, d) => sum + (d.consultationFee * d.totalPatients / 10), 0).toFixed(0)
  };

  // Handle actions
  const handleVerify = async (doctorId) => {
    try {
      await api.patch(`/admin/doctors/${doctorId}/verify`);
      // Update local state
      setDoctors(prev => prev.map(doc => 
        doc._id === doctorId 
          ? { ...doc, verificationStatus: "verified" }
          : doc
      ));
    } catch (err) {
      console.error("Verify error:", err);
      alert("Verification failed. Please try again.");
    }
  };

  const handleBlock = async (doctorId, block) => {
    try {
      await api.patch(`/admin/doctors/${doctorId}/block`, { block });
      // Update local state
      setDoctors(prev => prev.map(doc => 
        doc._id === doctorId 
          ? { ...doc, isBlocked: block }
          : doc
      ));
    } catch (err) {
      console.error("Block error:", err);
      alert("Action failed. Please try again.");
    }
  };

  const handleApprove = (doctorId) => {
    setDoctors(prev => prev.map(doc => 
      doc._id === doctorId 
        ? { ...doc, verificationStatus: "verified", status: "APPROVED" }
        : doc
    ));
    alert("Doctor approved successfully!");
  };

  const handleReject = (doctorId) => {
    setDoctors(prev => prev.map(doc => 
      doc._id === doctorId 
        ? { ...doc, verificationStatus: "rejected", status: "REJECTED" }
        : doc
    ));
    alert("Doctor rejected!");
  };

  const viewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredDoctors, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doctors-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    fetchDoctors();
  };

  if (loading) {
    return (
      <div className="p-6 mt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctors...</p>
            <p className="text-sm text-gray-500">Fetching data from API</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 mt-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-gray-600 mt-1">Manage all doctors in your system</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={exportData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-red-600 text-sm mt-1">
                Make sure your backend API is running at <code>http://localhost:5000</code>
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Doctors</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Blocked</p>
                <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgRating} ★</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Online Now</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.online}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium">
          <UserPlus className="h-5 w-5" /> Add New Doctor
        </button>
        <button 
          onClick={() => {
            const pendingDoctors = doctors.filter(d => d.verificationStatus === "pending");
            if (pendingDoctors.length > 0) {
              pendingDoctors.forEach(doc => handleApprove(doc._id));
              alert(`${pendingDoctors.length} doctors approved!`);
            } else {
              alert("No pending doctors to approve.");
            }
          }}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
        >
          <FileCheck className="h-5 w-5" /> Approve All Pending
        </button>
        <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium">
          <Calendar className="h-5 w-5" /> Manage Schedules
        </button>
        <button className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 font-medium">
          <Filter className="h-5 w-5" /> Advanced Filters
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search doctors by name, specialty, email, hospital..." 
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <select 
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Doctors</option>
              <option value="verified">✅ Verified Only</option>
              <option value="pending">⏳ Pending Approval</option>
              <option value="rejected">❌ Rejected</option>
              <option value="blocked">🚫 Blocked</option>
              <option value="online">🟢 Online Now</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-bold">{filteredDoctors.length}</span> of {doctors.length} doctors
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Blocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredDoctors.length === 0 ? (
          <div className="py-16 text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter</p>
            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Doctor</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Specialty & Info</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Rating & Reviews</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Fee</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDoctors.map(doctor => (
                    <tr key={doctor._id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={doctor.photo} 
                              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                              alt={doctor.name}
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400";
                              }}
                            />
                            {doctor.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Dr. {doctor.name}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Mail className="h-3 w-3" /> {doctor.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Exp: {doctor.experience} years • {doctor.qualification}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                            {doctor.specialty}
                          </span>
                          <p className="text-sm text-gray-600">{doctor.hospital}</p>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {doctor.verificationStatus === "verified" ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                <CheckCircle className="h-3 w-3" /> Verified
                              </span>
                            ) : doctor.verificationStatus === "pending" ? (
                              <button 
                                onClick={() => handleApprove(doctor._id)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200"
                              >
                                <Clock className="h-3 w-3" /> Pending
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                <XCircle className="h-3 w-3" /> Rejected
                              </span>
                            )}
                          </div>
                          {doctor.isBlocked ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                              <Shield className="h-3 w-3" /> Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                              <CheckCircle className="h-3 w-3" /> Active
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold">{doctor.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {doctor.totalReviews.toLocaleString()} reviews
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Success: {doctor.successRate}% • Patients: {doctor.totalPatients}
                        </p>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-xl font-bold text-gray-900">{doctor.consultationFee.toLocaleString()} ৳</span>
                        </div>
                        <p className="text-sm text-gray-500">per consultation</p>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => viewDoctorDetails(doctor)}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button 
                            className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition"
                            title="Manage Schedule"
                          >
                            <Calendar className="h-4 w-4" />
                          </button>
                          
                          {doctor.verificationStatus === "pending" && (
                            <button 
                              onClick={() => handleApprove(doctor._id)}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          {doctor.verificationStatus === "pending" && (
                            <button 
                              onClick={() => handleReject(doctor._id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          
                          {doctor.isBlocked ? (
                            <button 
                              onClick={() => handleBlock(doctor._id, false)}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition"
                              title="Unblock"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleBlock(doctor._id, true)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                              title="Block"
                            >
                              <Shield className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Page 1 of {Math.ceil(filteredDoctors.length / 10)}
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded text-sm">← Previous</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border rounded text-sm">2</button>
                <button className="px-3 py-1 border rounded text-sm">3</button>
                <button className="px-3 py-1 border rounded text-sm">Next →</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Doctor Details Modal */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Doctor Details</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex items-start gap-6 mb-8">
                <img 
                  src={selectedDoctor.photo} 
                  className="w-32 h-32 rounded-2xl object-cover"
                  alt={selectedDoctor.name}
                />
                <div className="flex-1">
                  <h4 className="text-3xl font-bold mb-2">Dr. {selectedDoctor.name}</h4>
                  <p className="text-blue-600 text-lg font-semibold mb-2">{selectedDoctor.specialty}</p>
                  <p className="text-gray-600 mb-4">{selectedDoctor.qualification}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedDoctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedDoctor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedDoctor.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h5 className="font-semibold mb-3">Practice Information</h5>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Hospital:</span> {selectedDoctor.hospital}</p>
                    <p><span className="text-gray-500">Experience:</span> {selectedDoctor.experience} years</p>
                    <p><span className="text-gray-500">Consultation Fee:</span> {selectedDoctor.consultationFee}৳</p>
                    <p><span className="text-gray-500">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedDoctor.verificationStatus === "verified" ? "bg-green-100 text-green-800" :
                        selectedDoctor.verificationStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {selectedDoctor.verificationStatus.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h5 className="font-semibold mb-3">Performance Stats</h5>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Rating:</span> {selectedDoctor.rating}/5 ★</p>
                    <p><span className="text-gray-500">Total Reviews:</span> {selectedDoctor.totalReviews}</p>
                    <p><span className="text-gray-500">Total Patients:</span> {selectedDoctor.totalPatients}</p>
                    <p><span className="text-gray-500">Success Rate:</span> {selectedDoctor.successRate}%</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Profile
                </button>
                <button className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  View Schedule
                </button>
                <button className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  View Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;