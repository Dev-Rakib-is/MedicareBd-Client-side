import { useState, useEffect } from "react";
import { Circles } from "react-loading-icons";
import Swal from "sweetalert2";
import api from "../../api/api";
import {
  Eye,
  X,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Award,
  MapPin,
  Clock,
} from "lucide-react";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [datePickerDoctor, setDatePickerDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doctors/admin/all");
      console.log("API Response:", res.data);
      if (res.data?.success) setDoctors(res.data.doctors);
    } catch (err) {
      console.log("Error", "Failed to load doctors.", "error", err);
    } finally {
      setLoading(false);
    }
  };

  // Search filter specialization
  const filteredDoctors = doctors.filter((d) => {
    const q = search.toLowerCase().trim();
    const specializationName =
      typeof d?.specialization === "object"
        ? d?.specialization?.name?.toLowerCase() || ""
        : String(d?.specialization || "").toLowerCase();

    const matchesSearch =
      !q || d.name?.toLowerCase().includes(q) || specializationName.includes(q);

    const matchesFilter = filter === "all" || d.status === filter.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  const updateStatus = async (id, status, name) => {
    const confirm = await Swal.fire({
      title: "Confirm",
      text: `${status} ${name}?`,
      icon: "warning",
      showCancelButton: true,
    });
    if (!confirm.isConfirmed) return;

    try {
      const endpoint =
        status === "APPROVED"
          ? `/doctors/admin/approve/${id}`
          : `/doctors/admin/status/${id}`;
      await api.patch(endpoint, { status });
      setDoctors((prev) =>
        prev.map((d) => (d._id === id ? { ...d, status } : d))
      );
      Swal.fire("Success", `Doctor ${status.toLowerCase()}.`, "success");
    } catch (err) {
      Swal.fire("Error", "Action failed.", "error");
    }
  };

  const handleToggleFeatured = async (doctor) => {
    if (!doctor.isFeatured) {
      setDatePickerDoctor(doctor);
      setSelectedDate(doctor.featuredUntil?.slice(0, 10) || "");
    } else {
      const result = await Swal.fire({
        title: "Remove from Featured?",
        text: `Do you want to remove ${doctor.name} from featured list?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        try {
          await api.patch(`/doctors/admin/featured/${doctor._id}`, {
            isFeatured: false,
            featuredUntil: null,
          });
          setDoctors((prev) =>
            prev.map((d) =>
              d._id === doctor._id
                ? { ...d, isFeatured: false, featuredUntil: null }
                : d
            )
          );

          Swal.fire("Success", "Doctor removed from featured list", "success");
        } catch (err) {
          Swal.fire("Error", "Failed to remove from featured", "error");
        }
      }
    }
  };

  const handleDateConfirm = async () => {
    if (!datePickerDoctor || !selectedDate) {
      Swal.fire("Warning", "Please select a date", "warning");
      return;
    }

    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDateObj < today) {
      Swal.fire("Error", "Cannot select a past date", "error");
      return;
    }

    try {
      await api.patch(`/doctors/admin/featured/${datePickerDoctor._id}`, {
        featuredUntil: selectedDate,
        isFeatured: true,
      });

      //  Update local state immediately
      setDoctors((prev) =>
        prev.map((d) =>
          d._id === datePickerDoctor._id
            ? { ...d, isFeatured: true, featuredUntil: selectedDate }
            : d
        )
      );

      Swal.fire("Success", "Doctor featured successfully", "success");

      // Close date picker
      setDatePickerDoctor(null);
      setSelectedDate("");
    } catch (err) {
      Swal.fire("Error", "Failed to feature doctor", "error");
    }
  };

  const openDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };
  const getSpecializationName = (spec) => {
    if (!spec) return "No Specialization";
    if (typeof spec === "object") {
      return spec.name || "No Specialization";
    }
    return spec;
  };

  return (
    <div className="p-6 mt-16">
      <h1 className="text-3xl font-bold mb-2">Doctor Management</h1>
      <p className="text-gray-600 mb-6">
        Manage and review all registered doctors.
      </p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {["Total", "Approved", "Pending", "Rejected"].map((stat) => (
          <div
            key={stat}
            className="bg-white p-4 rounded-lg shadow text-center"
          >
            <div className="text-2xl font-bold">
              {
                doctors.filter(
                  (d) => stat === "Total" || d.status === stat.toUpperCase()
                ).length
              }
            </div>
            <div className="text-sm text-gray-500">{stat}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 border p-3 rounded-lg"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-3 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["all", "approved", "pending", "rejected"].map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={fetchDoctors}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg font-medium"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 py-20">
          <Circles fill="#3b82f6" stroke="#60a5fa" height="80" width="80" />
          <h3 className="mt-6 text-xl font-semibold text-gray-700">
            Loading Doctor list
          </h3>
          <p className="mt-2 text-gray-500">
            Preparing your doctor management panel...
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Name & Specialty",
                  "Status",
                  "Fee",
                  "Featured",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="p-4 text-left font-semibold text-gray-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((d) => (
                <tr key={d._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-sm text-gray-500">
                      {getSpecializationName(d.specialization)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                      ${
                        d.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : d.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium">${d.fee || 0}</td>

                  {/*  Featured Section */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="relative inline-block w-10 align-middle select-none">
                        <input
                          type="checkbox"
                          id={`featured-${d._id}`}
                          checked={d.isFeatured || false}
                          onChange={() => handleToggleFeatured(d)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`featured-${d._id}`}
                          className={`block h-6 w-10 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                            d.isFeatured ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`block h-5 w-5 mt-0.5 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                              d.isFeatured ? "translate-x-5" : "translate-x-0.5"
                            }`}
                          />
                        </label>
                      </div>
                      {d.isFeatured && d.featuredUntil && (
                        <span className="text-sm text-gray-600">
                          until {new Date(d.featuredUntil).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDoctorModal(d)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1"
                      >
                        <Eye size={14} /> View
                      </button>

                      {d.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(d._id, "APPROVED", d.name)
                            }
                            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(d._id, "REJECTED", d.name)
                            }
                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {d.status === "APPROVED" && (
                        <button
                          onClick={() =>
                            updateStatus(d._id, "REJECTED", d.name)
                          }
                          className="font-semibold px-3 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                        >
                          Block
                        </button>
                      )}
                      {d.status === "REJECTED" && (
                        <button
                          onClick={() =>
                            updateStatus(d._id, "APPROVED", d.name)
                          }
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
      )}

      {/* Date Picker Modal */}
      {datePickerDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="border-b p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                Feature Dr. {datePickerDoctor.name}
              </h3>
              <button
                onClick={() => setDatePickerDoctor(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Select end date for featuring:
              </p>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border p-3 rounded-lg mb-4"
                min={new Date().toISOString().slice(0, 10)}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleDateConfirm}
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium"
                  disabled={!selectedDate}
                >
                  Confirm Feature
                </button>
                <button
                  onClick={() => setDatePickerDoctor(null)}
                  className="flex-1 border p-3 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Details Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center shadow-sm">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <User size={28} className="text-blue-600" />{" "}
                  {selectedDoctor.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  {getSpecializationName(selectedDoctor.specialization)}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-400" />
                    <span className="font-medium">Email:</span>
                    <p>
                      {selectedDoctor.email || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-gray-400" />
                    <span className="font-medium">Phone:</span>
                    <p>{selectedDoctor.phone || "N/A"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} className="text-gray-400" />
                    <span className="font-medium">Fee:</span>
                    <p>${selectedDoctor.fee || 0}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award size={20} className="text-gray-400" />
                    <span className="font-medium">Qualification:</span>
                    <p>{selectedDoctor.qualification || "Not specified"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-gray-400" />
                    <span className="font-medium">Experience:</span>
                    <p>{selectedDoctor.experience || 0} years</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-gray-400" />
                    <span className="font-medium">Chamber:</span>
                    <p>{selectedDoctor.chamber || "Not specified"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-gray-400" />
                    <span className="font-medium">Working Hours:</span>
                    <p>
                      {selectedDoctor.workingHours?.from} -{" "}
                      {selectedDoctor.workingHours?.to}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium
                      ${
                        selectedDoctor.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : selectedDoctor.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedDoctor.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
