import { useEffect, useState } from "react";
import api from "../../api/api";
import DoctorList from "../doctor/DoctorList";
import DoctorFilters from "../doctor/DoctorFilters";
import BookingModal from "../doctor/BookingModal";
import PremiumBanner from "../PremiumBanner";
import FloatingCompare from "../FloatingCompare";
import { Download, Users, Shield, Star, Filter} from "lucide-react";

const PatientDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, available: 0, avgRating: 4.5 });
  const [expandedCard, setExpandedCard] = useState(null);
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
    ...doctor,
    tags: Array.isArray(doctor.tags) ? doctor.tags : doctor.tags ? [doctor.tags] : ["Verified", "Experienced"],
    languages: Array.isArray(doctor.languages) ? doctor.languages : doctor.languages ? [doctor.languages] : ["English", "Bengali"],
    rating: doctor.rating || 4.5,
    totalReviews: doctor.totalReviews || 50,
    nextAvailable: doctor.nextAvailable || "Tomorrow",
    isOnline: doctor.isOnline || false,
    isPremium: doctor.isPremium || false,
    responseTime: doctor.responseTime || "20 mins",
    chamber: doctor.chamber || "Medical Center",
    qualification: doctor.qualification || "MBBS",
    achievements: doctor.achievements || ["Certified Specialist"],
    consultationTypes: doctor.consultationTypes || ["In-person", "Video", "Phone"]
  });

  // Fetch doctors
  const loadDoctors = async () => {
    try {
      setLoading(true);
      const [doctorRes, specRes] = await Promise.all([
        api.get("/doctors"),
        api.get("/specializations")
      ]);

      const doctorList = Array.isArray(doctorRes.data?.doctors) 
        ? doctorRes.data.doctors 
        : doctorRes.data || [];

      const specList = Array.isArray(specRes.data) 
        ? specRes.data 
        : specRes.data?.specializations || [];

      // Enhanced doctors with mock data
      const enhancedDoctors = doctorList.length > 0 
        ? doctorList.map((doc, index) => {
            const normalized = normalizeDoctorData(doc);
            return {
              ...normalized,
              rating: normalized.rating || (Math.random() * 0.5 + 4.5),
              totalReviews: normalized.totalReviews || (Math.floor(Math.random() * 100) + 50),
              nextAvailable: normalized.nextAvailable || ["Today", "Tomorrow", "In 2 days"][index % 3],
              isOnline: normalized.isOnline || index % 3 === 0,
              isPremium: normalized.isPremium || index % 4 === 0,
              responseTime: normalized.responseTime || `${Math.floor(Math.random() * 30) + 10} mins`,
            };
          })
        : [
            {
              _id: "1",
              name: "Dr. Abdullah Karim",
              specialization: "Cardiology",
              experience: 12,
              fee: 1800,
              status: "APPROVED",
              photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
              rating: 4.9,
              totalReviews: 124,
              nextAvailable: "Today 4 PM",
              isOnline: true,
              isPremium: true,
              responseTime: "15 mins",
              chamber: "Apollo Hospital, Dhaka",
              qualification: "MBBS, MD, DM (Cardiology)",
              tags: ["Expert", "Top Rated"],
              languages: ["English", "Bengali", "Arabic"],
              consultationTypes: ["In-person", "Video", "Phone"]
            },
            {
              _id: "2",
              name: "Dr. Rakibul Islam",
              specialization: "Neurology",
              experience: 8,
              fee: 1500,
              status: "APPROVED",
              photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
              rating: 4.7,
              totalReviews: 89,
              nextAvailable: "Tomorrow 11 AM",
              isOnline: false,
              isPremium: false,
              responseTime: "25 mins",
              chamber: "Square Hospital, Dhaka",
              qualification: "MBBS, FCPS (Neurology)",
              tags: ["Patient Favorite"],
              languages: ["English", "Bengali"],
              consultationTypes: ["In-person", "Video"]
            },
            {
              _id: "3",
              name: "Dr. Smith Johnson",
              specialization: "Orthopedics",
              experience: 15,
              fee: 2000,
              status: "APPROVED",
              photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
              rating: 4.8,
              totalReviews: 156,
              nextAvailable: "Today 6 PM",
              isOnline: true,
              isPremium: true,
              responseTime: "10 mins",
              chamber: "Ortho Care Center",
              qualification: "MBBS, MS (Orthopedics)",
              tags: ["Expert", "24/7"],
              languages: ["English", "Bengali", "Hindi"],
              consultationTypes: ["In-person", "Video"]
            }
          ].map(normalizeDoctorData);

      setDoctors(enhancedDoctors);
      setFilteredDoctors(enhancedDoctors);
      setSpecializations(specList.length > 0 ? specList : [
        { _id: "1", name: "Cardiology", count: 24 },
        { _id: "2", name: "Neurology", count: 18 },
        { _id: "3", name: "Orthopedics", count: 32 },
        { _id: "4", name: "Pediatrics", count: 28 }
      ]);

      setStats({
        total: enhancedDoctors.length,
        available: enhancedDoctors.filter(d => d.status === "APPROVED").length,
        avgRating: 4.7
      });

    } catch (err) {
      console.error("Error fetching data:", err);
      // Fallback mock data
      const mockDoctors = [
        {
          _id: "1",
          name: "Dr. Abdullah Karim",
          specialization: "Cardiology",
          experience: 12,
          fee: 1800,
          status: "APPROVED",
          photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
          rating: 4.9,
          totalReviews: 124,
          nextAvailable: "Today 4 PM",
          isOnline: true,
          isPremium: true,
          responseTime: "15 mins",
          chamber: "Apollo Hospital, Dhaka",
          qualification: "MBBS, MD, DM (Cardiology)",
          tags: ["Expert", "Top Rated"],
          languages: ["English", "Bengali", "Arabic"],
          consultationTypes: ["In-person", "Video", "Phone"]
        }
      ].map(normalizeDoctorData);
      
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
      setStats({
        total: mockDoctors.length,
        available: mockDoctors.length,
        avgRating: 4.7
      });
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
    const { search, selectedSpec, selectedSort, selectedAvailability, selectedExperience, priceRange } = filters;

    if (search) {
      list = list.filter(d =>
        d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
        d.qualification?.toLowerCase().includes(search.toLowerCase()) ||
        d.chamber?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedSpec) {
      list = list.filter(d => d.specialization === selectedSpec);
    }

    if (selectedAvailability === "online") {
      list = list.filter(d => d.isOnline);
    } else if (selectedAvailability === "today") {
      list = list.filter(d => d.nextAvailable?.includes("Today"));
    }

    if (selectedExperience !== "all") {
      const [min, max] = selectedExperience.split("-").map(Number);
      list = list.filter(d => {
        if (max) return d.experience >= min && d.experience <= max;
        return d.experience >= min;
      });
    }

    list = list.filter(d => d.fee >= priceRange[0] && d.fee <= priceRange[1]);

    // Sorting
    if (selectedSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "experience") {
      list.sort((a, b) => b.experience - a.experience);
    } else if (selectedSort === "price_low") {
      list.sort((a, b) => a.fee - b.fee);
    } else if (selectedSort === "price_high") {
      list.sort((a, b) => b.fee - a.fee);
    }

    setFilteredDoctors(list);
  }, [filters, doctors]);

  // Favorite toggle
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  // Share doctor
  const shareDoctor = async (doctor) => {
    try {
      const shareData = {
        title: `Dr. ${doctor.name} - ${doctor.specialization}`,
        text: `Check out Dr. ${doctor.name}, ${doctor.specialization} specialist. Experience: ${doctor.experience} years, Fee: ${doctor.fee}৳`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('Doctor information copied to clipboard!');
      }
    } catch (err) {
      console.error('Share error:', err);
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
      alert(`Appointment booked with ${selectedDoctor.name}! We'll contact you shortly.`);
      closeBookingModal();
    }
  };

  // View doctor details
  const viewDoctorDetails = (doctorId) => {
    window.location.href = `/doctor/${doctorId}`;
  };

  // Export doctors list
  const exportDoctorsList = () => {
    const dataStr = JSON.stringify(filteredDoctors, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `doctors-list-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading doctors...</p>
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
              <h1 className="text-4xl font-bold text-gray-900">Find Your Specialist</h1>
              <p className="text-gray-600 mt-2">Connect with {stats.total}+ verified doctors</p>
              
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">{stats.total} Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">{stats.available} Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">{stats.avgRating}/5 Avg Rating</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={exportDoctorsList}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2 transition"
              >
                <Download className="h-5 w-5" />
                Export List
              </button>
              <button
                onClick={() => alert('Advanced filter feature coming soon!')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
              >
                <Filter className="h-5 w-5" />
                Advanced Filter
              </button>
            </div>
          </div>
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
            Showing <span className="font-bold">{filteredDoctors.length}</span> doctors
            {filters.search && ` for "${filters.search}"`}
            {filters.selectedSpec && ` in ${filters.selectedSpec}`}
          </p>
          <button
            onClick={() => setFilters({
              search: "",
              selectedSpec: "",
              selectedSort: "recommended",
              selectedAvailability: "all",
              selectedExperience: "all",
              priceRange: [0, 5000],
              viewMode: "grid"
            })}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear All Filters
          </button>
        </div>

        {/* Doctor List */}
        <DoctorList
          doctors={filteredDoctors}
          expandedCard={expandedCard}
          setExpandedCard={setExpandedCard}
          toggleFavorite={toggleFavorite}
          favorites={favorites}
          openBookingModal={openBookingModal}
          viewDoctorDetails={viewDoctorDetails}
          shareDoctor={shareDoctor}
          viewMode={filters.viewMode}
        />

        {/* Premium Banner */}
        <PremiumBanner />
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={closeBookingModal}
          onConfirm={handleBookAppointment}
        />
      )}

      {/* Floating Buttons */}
      <FloatingCompare />
      
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-20 right-6 bg-gray-800 text-white p-3 rounded-full shadow-2xl hover:bg-gray-900 transition"
      >
        ↑
      </button>
    </div>
  );
};

export default PatientDoctor;