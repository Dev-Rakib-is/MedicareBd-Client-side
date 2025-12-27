import { useState } from "react";
import { Star, Award, MapPin, Clock, Video, Phone, Heart, Share2, Calendar } from "lucide-react";

const DoctorCard = ({
  doctor,
  expandedCard,
  setExpandedCard,
  toggleFavorite,
  favorites,
  openBookingModal,
  viewDoctorDetails,
  shareDoctor
}) => {
  const [localExpanded, setLocalExpanded] = useState(false);

  const handleExpand = (doctorId) => {
    setLocalExpanded(!localExpanded);
    if (setExpandedCard) {
      setExpandedCard(expandedCard === doctorId ? null : doctorId);
    }
  };

  // Safe tag rendering
  const renderTags = () => {
    const tags = Array.isArray(doctor?.tags) ? doctor.tags : [];
    const languages = Array.isArray(doctor?.languages) ? doctor.languages : [];
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {languages.map((lang, index) => (
          lang && (
            <span
              key={`lang-${index}`}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {lang}
            </span>
          )
        ))}
      </div>
    );
  };

  if (!doctor) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Doctor Header */}
      <div className="relative">
        <img
          src={doctor.photo_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"}
          alt={doctor.name}
          className="w-full h-56 object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400";
          }}
        />
        
        {/* Premium Badge */}
        {doctor.isPremium && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Award className="h-3 w-3" />
            PREMIUM
          </div>
        )}
        
        {/* Online Status */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
            doctor.isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}>
            <div className={`h-2 w-2 rounded-full ${doctor.isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
            <span className="text-xs font-medium">{doctor.isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => toggleFavorite(doctor._id)}
            className={`p-2 rounded-full shadow transition ${
              favorites.includes(doctor._id)
                ? "bg-red-50 text-red-500"
                : "bg-white text-gray-400 hover:text-red-400"
            }`}
            title={favorites.includes(doctor._id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${favorites.includes(doctor._id) ? "fill-red-400" : ""}`} />
          </button>
          <button
            onClick={() => shareDoctor(doctor)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-50 transition"
            title="Share doctor"
          >
            <Share2 className="h-5 w-5 text-blue-500" />
          </button>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
            <p className="text-blue-600 font-semibold">{doctor.specialization?.name}</p>
          </div>
          <button
            onClick={() => handleExpand(doctor._id)}
            className="text-gray-400 hover:text-gray-600 transition ml-2"
            title={localExpanded ? "Show less" : "Show more"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d={localExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
              />
            </svg>
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(doctor.rating || 0) 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600 font-medium">{(doctor.rating || 4.5).toFixed(1)}</span>
          <span className="text-gray-500 text-sm">({doctor.totalReviews || 50} reviews)</span>
        </div>

        {/* Tags */}
        {renderTags()}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">Experience</div>
            <div className="font-bold text-blue-700">{doctor.experience || 0} years</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">Fee</div>
            <div className="font-bold text-green-700">{doctor.fee || 0} ৳</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">Response</div>
            <div className="font-bold text-purple-700">{doctor.responseTime || "20 mins"}</div>
          </div>
        </div>

        {/* Expanded Details */}
        {(localExpanded || expandedCard === doctor._id) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{doctor.qualification || "MBBS"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{doctor.chamber || "Medical Center"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Next: {doctor.nextAvailable || "Tomorrow"}</span>
              </div>
              {doctor.consultationTypes && (
                <div className="flex gap-2 mt-2">
                  {doctor.consultationTypes.map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                      {type === "Video" && <Video className="h-3 w-3" />}
                      {type === "Phone" && <Phone className="h-3 w-3" />}
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => viewDoctorDetails(doctor._id)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View Profile
          </button>
          <button
            onClick={() => openBookingModal(doctor)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            Book Now
          </button>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
          <span>👨‍⚕️ {doctor.experience || 0}+ years exp</span>
          <span>💬 {doctor.totalReviews || 50}+ reviews</span>
          <span>⚡ {doctor.responseTime || "20 mins"} response</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;