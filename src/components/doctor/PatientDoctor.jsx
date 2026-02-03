import { useEffect, useState } from "react";
import api from "../../api/api";
import DoctorList from "../doctor/DoctorList";
import DoctorFilters from "../doctor/DoctorFilters";
import BookingModal from "../doctor/BookingModal";
import { Users, Shield, Star, RefreshCw, AlertCircle } from "lucide-react";

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
    selectedExperience: "all",
    priceRange: [0, 5000],
    viewMode: "grid",
  });

  const normalizeDoctor = (d) => ({
    _id: d._id,
    name: d.name || "Unknown Doctor",
    specialization: d.specialization || "General Medicine",
    experience: d.experience || 0,
    fee: d.fee || 500,
    rating: d.rating || 4.5,
    photo_url: d.photo_url || "/default-doctor.png",
    status: d.status || "APPROVED",
  });

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const [doctorRes, specRes] = await Promise.all([
        api.get("/doctors"),
        api.get("/departments"),
      ]);

      const normalizedDoctors = (doctorRes.data?.doctors || []).map(
        normalizeDoctor,
      );
      const specs = specRes.data?.specializations || [];

      setDoctors(normalizedDoctors);
      setFilteredDoctors(normalizedDoctors);
      setSpecializations(specs);
    } catch (err) {
      console.error(err);
      setError("Unable to load doctors.");
      setDoctors([]);
      setFilteredDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Filter & Sort
  useEffect(() => {
    let list = [...doctors];

    if (filters.search)
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          d.specialization.toLowerCase().includes(filters.search.toLowerCase()),
      );

    if (filters.selectedSpec)
      list = list.filter((d) => d.specialization === filters.selectedSpec);

    if (filters.selectedExperience !== "all") {
      const [min, max] = filters.selectedExperience.split("-").map(Number);
      list = list.filter((d) => {
        const exp = d.experience;
        return max ? exp >= min && exp <= max : exp >= min;
      });
    }

    list = list.filter(
      (d) => d.fee >= filters.priceRange[0] && d.fee <= filters.priceRange[1],
    );

    switch (filters.selectedSort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        list.sort((a, b) => b.experience - a.experience);
        break;
      case "price_low":
        list.sort((a, b) => a.fee - b.fee);
        break;
      case "price_high":
        list.sort((a, b) => b.fee - a.fee);
        break;
      default:
        list.sort((a, b) => b.rating - a.rating);
    }

    setFilteredDoctors(list);
  }, [filters, doctors]);

  const stats = {
    total: doctors.length,
    available: doctors.filter((d) => d.status === "APPROVED").length,
    avgRating: doctors.length
      ? (
          doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length
        ).toFixed(1)
      : 0,
  };

  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };
  const closeBooking = () => {
    setSelectedDoctor(null);
    setShowBookingModal(false);
  };

  if (loading)
    return <div className="text-center pt-24">Loading doctors...</div>;

  return (
    <div className="min-h-screen pt-20 bg-blue-50">
      {/* Header & Stats */}
      <div className="bg-white shadow p-6">
        <h1 className="text-3xl font-bold">Find Your Specialist</h1>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Users /> {stats.total} Doctors
          </div>
          <div className="flex items-center gap-2">
            <Shield /> {stats.available} Available
          </div>
          <div className="flex items-center gap-2">
            <Star /> {stats.avgRating}/5 Avg Rating
          </div>
        </div>
      </div>

      {/* Filters */}
      <DoctorFilters
        filters={filters}
        setFilters={setFilters}
        specializations={specializations}
      />

      {/* Doctor List */}
      {filteredDoctors.length > 0 ? (
        <DoctorList
          doctors={filteredDoctors}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          openBookingModal={openBooking}
        />
      ) : (
        <div className="text-center p-16 bg-white rounded shadow mt-6">
          <p>No doctors found.</p>
          <button onClick={loadDoctors} className="text-blue-600 mt-2">
            Refresh
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={closeBooking}
          onConfirm={() => alert(`Booked with ${selectedDoctor.name}`)}
        />
      )}
    </div>
  );
};

export default PatientDoctor;
