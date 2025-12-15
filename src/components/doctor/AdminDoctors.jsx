import { useState, useEffect } from "react";
import { Circles } from "react-loading-icons";
import Swal from "sweetalert2";
import api from "../../api/api";
import { Eye, X, User, Mail, Phone, DollarSign, Calendar, Award, MapPin, Clock } from "lucide-react";

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch Doctors
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const res = await api.get("/doctors/admin/all");
            if (res.data?.success) {
                setDoctors(res.data.doctors);
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to load doctors.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    // Filter & Search Logic
    const filteredDoctors = doctors.filter(d => {
        const q = search.toLowerCase().trim();
        const matchesSearch = !q ||
            d.name?.toLowerCase().includes(q) ||
            d.specialization?.toLowerCase().includes(q);
        const matchesFilter = filter === "all" || d.status === filter.toUpperCase();
        return matchesSearch && matchesFilter;
    });

    // Update Status
    const updateStatus = async (id, status, name) => {
        const confirm = await Swal.fire({
            title: 'Confirm',
            text: `${status} ${name}?`,
            icon: 'warning',
            showCancelButton: true,
        });
        if (!confirm.isConfirmed) return;

        try {
            const endpoint = status === "APPROVED"
                ? `/doctors/approve/${id}`
                : `/doctors/status/${id}`;
            await api.patch(endpoint, { status });

            setDoctors(prev => prev.map(d =>
                d._id === id ? { ...d, status } : d
            ));
            Swal.fire('Success', `Doctor ${status.toLowerCase()}.`, 'success');
        } catch (err) {
            Swal.fire('Error', 'Action failed.', 'error');
        }
    };

    // Open Modal with Doctor Details
    const openDoctorModal = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    // Close Modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedDoctor(null);
    };

    return (
        <div className="p-6 mt-16">
            <h1 className="text-3xl font-bold mb-2">Doctor Management</h1>
            <p className="text-gray-600 mb-6">Manage and review all registered doctors.</p>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {['Total', 'Approved', 'Pending', 'Rejected'].map((stat) => (
                    <div key={stat} className="bg-white p-4 rounded-lg shadow text-center">
                        <div className="text-2xl font-bold">
                            {doctors.filter(d => stat === 'Total' || d.status === stat.toUpperCase()).length}
                        </div>
                        <div className="text-sm text-gray-500">{stat}</div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-6">
                <input
                    className="flex-1 border p-3 rounded-lg"
                    placeholder="Search doctors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="border p-3 rounded-lg" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    {['all', 'approved', 'pending', 'rejected'].map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                </select>
                <button
                    onClick={fetchDoctors}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg font-medium"
                >
                    Refresh
                </button>
            </div>

            {/* Doctors Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center bg-gray-50 py-20">
                    <Circles fill="#3b82f6" stroke="#60a5fa" height="80" width="80" />
                    <h3 className="mt-6 text-xl font-semibold text-gray-700">Loading Doctor list</h3>
                    <p className="mt-2 text-gray-500">Preparing your doctor management panel...</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    {['Name & Specialty', 'Status', 'Fee', 'Action'].map((h) => (
                                        <th key={h} className="p-4 text-left font-semibold text-gray-700">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors.map(d => (
                                    <tr key={d._id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium">{d.name}</div>
                                            <div className="text-sm text-gray-500">{d.specialization}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                ${d.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    d.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium">${d.fee || 0}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {/* View Button */}
                                                <button
                                                    onClick={() => openDoctorModal(d)}
                                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1"
                                                    title="View Details"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </button>
                                                
                                                {/* Status Buttons */}
                                                {d.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(d._id, 'APPROVED', d.name)}
                                                            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(d._id, 'REJECTED', d.name)}
                                                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {d.status === 'APPROVED' && (
                                                    <button
                                                        onClick={() => updateStatus(d._id, 'REJECTED', d.name)}
                                                        className="font-semibold px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                                                    >
                                                        Block
                                                    </button>
                                                )}
                                                {d.status === 'REJECTED' && (
                                                    <button
                                                        onClick={() => updateStatus(d._id, 'APPROVED', d.name)}
                                                        className="font-semibold px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                                                    >
                                                        Restore
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredDoctors.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No doctors found.
                            </div>
                        )}
                    </div>

                    {/*  Doctor Details Modal */}
                    {showModal && selectedDoctor && (
                        <div className="fixed inset-0 backdrop-blur-xs  flex items-center justify-center z-50 p-4 ">
                            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-cyan-600">
                                {/* Modal Header */}
                                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold flex items-center gap-3">
                                            <User size={28} className="text-blue-600" />
                                            {selectedDoctor.name}
                                        </h3>
                                        <p className="text-gray-600 mt-1">{selectedDoctor.specialization}</p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Mail size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{selectedDoctor.email || selectedDoctor.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="font-medium">{selectedDoctor.phone || selectedDoctor.user?.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <DollarSign size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Consultation Fee</p>
                                                    <p className="font-medium text-green-600">${selectedDoctor.fee || 0}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Award size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Qualification</p>
                                                    <p className="font-medium">{selectedDoctor.qualification || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Experience</p>
                                                    <p className="font-medium">{selectedDoctor.experience || 0} years</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Chamber</p>
                                                    <p className="font-medium">{selectedDoctor.chamber || 'Not specified'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={20} className="text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Visiting Hours</p>
                                                    <p className="font-medium">{selectedDoctor.visitingHours || 'Not specified'}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-2">Status</p>
                                                <span className={`px-4 py-2 rounded-full text-sm font-medium
                                                    ${selectedDoctor.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        selectedDoctor.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'}`}>
                                                    {selectedDoctor.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="mt-8 pt-6 border-t">
                                        <p className="text-sm text-gray-500 mb-2">Registration Date</p>
                                        <p className="font-medium">
                                            {new Date(selectedDoctor.createdAt).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {/* Action Buttons in Modal */}
                                    <div className="mt-8 flex gap-3">
                                        {selectedDoctor.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        updateStatus(selectedDoctor._id, 'APPROVED', selectedDoctor.name);
                                                        closeModal();
                                                    }}
                                                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                                                >
                                                    Approve Doctor
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        updateStatus(selectedDoctor._id, 'REJECTED', selectedDoctor.name);
                                                        closeModal();
                                                    }}
                                                    className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                                                >
                                                    Reject Application
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDoctors;