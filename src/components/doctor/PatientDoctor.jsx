import { useEffect, useState } from "react";
import api from "../../api/api";
import DoctorList from "../doctor/DoctorList";
import DoctorFilters from "../doctor/DoctorFilters";
import BookingModal from "../doctor/BookingModal";
import {
  Download,
  Users,
  Shield,
  Star,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const PatientDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    selectedSpec: "",
    selectedSort: "recommended",
    selectedAvailability: "all",
    selectedExperience: "all",
    priceRange: [0, 5000],
    viewMode: "grid",
  });

  // Normalize doctor data
  const normalizeDoctorData = (doctor) => ({
    _id: doctor._id || doctor.id,
    name: doctor.name || doctor.fullName || "Unknown Doctor",
    specialization:
      doctor.specialization || doctor.speciality || "General Medicine",
    experience: doctor.experience || doctor.yearsOfExperience || 0,
    fee: doctor.fee || doctor.consultationFee || 500,
    status: doctor.status || "ACTIVE",
    photo_url:
      doctor.photo_url ||
      doctor.photoUrl ||
      doctor.profilePicture ||
      "/default-doctor.png",
    rating: doctor.rating || 4.5,
    totalReviews: doctor.totalReviews || 0,
    isOnline: doctor.isOnline || false,
    chamber: doctor.chamber || doctor.hospital || "Medical Center",
    qualification: doctor.qualification || "MBBS",
    consultationTypes: doctor.consultationTypes || [
      "In-person",
      "Video",
      "Phone",
    ],
  });

  // Fetch doctors
  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch doctors and specializations
      const [doctorRes, specRes] = await Promise.all([
        api.get("/doctors"),
        api.get("/departments"),
      ]);

      // Process doctors data
      const doctorList = Array.isArray(doctorRes.data?.doctors)
        ? doctorRes.data.doctors
        : doctorRes.data || [];

      const normalizedDoctors = doctorList.map((doctor) =>
        normalizeDoctorData(doctor)
      );

      // Process specializations
      const specList = Array.isArray(specRes.data)
        ? specRes.data
        : specRes.data?.specializations || [];

      setDoctors(normalizedDoctors);
      setFilteredDoctors(normalizedDoctors);
      setSpecializations(specList);
    } catch (err) {
      console.error("Error loading doctors:", err);
      setError("Unable to load doctors. Please try again.");
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Filter doctors
  useEffect(() => {
    let list = [...doctors];
    const {
      search,
      selectedSpec,
      selectedSort,
      selectedExperience,
      priceRange,
    } = filters;

    // Search filter
    if (search) {
      list = list.filter(
        (d) =>
          (d.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (d.specialization?.toLowerCase() || "").includes(search.toLowerCase())
      );
    }

    // Specialization filter
    if (selectedSpec) {
      list = list.filter((d) => d.specialization === selectedSpec);
    }

    // Experience filter
    if (selectedExperience !== "all") {
      const [min, max] = selectedExperience.split("-").map(Number);
      list = list.filter((d) => {
        const exp = d.experience || 0;
        if (max) return exp >= min && exp <= max;
        return exp >= min;
      });
    }

    // Price range filter
    list = list.filter((d) => {
      const fee = d.fee || 0;
      return fee >= priceRange[0] && fee <= priceRange[1];
    });

    // Sorting
    switch (selectedSort) {
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "experience":
        list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        break;
      case "price_low":
        list.sort((a, b) => (a.fee || 0) - (b.fee || 0));
        break;
      case "price_high":
        list.sort((a, b) => (b.fee || 0) - (a.fee || 0));
        break;
      default:
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredDoctors(list);
  }, [filters, doctors]);

  // Calculate stats
  const stats = {
    total: doctors.length,
    available: doctors.filter(
      (d) => d.status === "APPROVED" || d.status === "ACTIVE"
    ).length,
    avgRating:
      doctors.length > 0
        ? parseFloat(
            (
              doctors.reduce((sum, d) => sum + (d.rating || 0), 0) /
              doctors.length
            ).toFixed(1)
          )
        : 0,
  };

  // Favorite toggle
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Share doctor
  const shareDoctor = async (doctor) => {
    try {
      const shareData = {
        title: `Dr. ${doctor.name} - ${doctor.specialization}`,
        text: `Check out Dr. ${doctor.name}, ${doctor.specialization} specialist. Experience: ${doctor.experience} years, Fee: ${doctor.fee}$`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert("Doctor information copied to clipboard!");
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  // Booking modal
  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
  };

  const handleBookAppointment = () => {
    if (selectedDoctor) {
      alert(
        `Appointment booked with ${selectedDoctor.name}! We'll contact you shortly.`
      );
      closeBookingModal();
    }
  };

  // View doctor details
  const viewDoctorDetails = (doctorId) => {
    window.location.href = `/doctor/${doctorId}`;
  };

  // Export doctors list
  const exportDoctorsList = () => {
    if (filteredDoctors.length === 0) {
      alert("No doctors available to export.");
      return;
    }

    const dataStr = JSON.stringify(filteredDoctors, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `doctors-list.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Refresh data
  const refreshData = () => {
    loadDoctors();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-lg font-semibold text-gray-700">
            Loading doctors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-20">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Find Your Specialist
              </h1>
              <p className="text-gray-600 mt-2">
                {stats.total > 0
                  ? `Connect with ${stats.total}+ verified doctors`
                  : "No doctors available"}
              </p>

              {stats.total > 0 && (
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{stats.total} Doctors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">
                      {stats.available} Available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">
                      {stats.avgRating}/5 Avg Rating
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh
              </button>
              <button
                onClick={exportDoctorsList}
                disabled={filteredDoctors.length === 0}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
                  filteredDoctors.length === 0
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Download className="h-5 w-5" />
                Export
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">{error}</p>
                <button
                  onClick={refreshData}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <DoctorFilters
          filters={filters}
          setFilters={setFilters}
          specializations={specializations}
        />

        {/* Doctor Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-700">
            {filteredDoctors.length === 0 ? (
              <span>No doctors found</span>
            ) : (
              <>
                Showing{" "}
                <span className="font-bold">{filteredDoctors.length}</span>{" "}
                doctor{filteredDoctors.length !== 1 ? "s" : ""}
                {filters.search && ` for "${filters.search}"`}
                {filters.selectedSpec && ` in ${filters.selectedSpec}`}
              </>
            )}
          </p>
          <button
            onClick={() =>
              setFilters({
                search: "",
                selectedSpec: "",
                selectedSort: "recommended",
                selectedAvailability: "all",
                selectedExperience: "all",
                priceRange: [0, 5000],
                viewMode: "grid",
              })
            }
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear Filters
          </button>
        </div>

        {/* Doctor List */}
        {doctors.length > 0 ? (
          <DoctorList
            doctors={filteredDoctors}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            openBookingModal={openBookingModal}
            viewDoctorDetails={viewDoctorDetails}
            shareDoctor={shareDoctor}
            viewMode={filters.viewMode}
          />
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Doctors Available
            </h3>
            <p className="text-gray-600 mb-6">
              There are currently no doctors registered.
            </p>
            <button
              onClick={refreshData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={closeBookingModal}
          onConfirm={handleBookAppointment}
        />
      )}
    </div>
  );
};

export default PatientDoctor;
