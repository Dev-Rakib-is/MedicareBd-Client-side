import DoctorCard from "./DoctorCard";

const DoctorList = ({
  doctors,
  expandedCard,
  setExpandedCard,
  toggleFavorite,
  favorites,
  openBookingModal,
  viewDoctorDetails,
  shareDoctor,
  viewMode,
}) => {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          No Doctors Found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We couldn't find any doctors matching your criteria. Try adjusting
          your search filters or clear all filters.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Refresh Results
        </button>
      </div>
    );
  }

  // Grid View
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
            expandedCard={expandedCard}
            setExpandedCard={setExpandedCard}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            openBookingModal={openBookingModal}
            viewDoctorDetails={viewDoctorDetails}
            shareDoctor={shareDoctor}
          />
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {doctors.map((doctor) => {
        return (
          <div
            key={doctor._id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Doctor Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={
                    doctor.photo_url ||
                    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
                  }
                  alt={doctor.name}
                  className="w-32 h-32 rounded-xl object-cover shadow"
                />
                {doctor.isPremium && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                    PREMIUM
                  </div>
                )}
              </div>

              {/* Doctor Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-2">
                      {typeof doctor.specialization === "string"
                        ? doctor.specialization
                        : doctor.specialization?.name || "General Medicine"}
                    </p>

                    <p className="text-gray-600 mb-3">{doctor.qualification}</p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-semibold">
                          {doctor.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-500">
                          ({doctor.totalReviews} reviews)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{doctor.experience} years experience</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{doctor.chamber}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(doctor.tags) &&
                        doctor.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      {Array.isArray(doctor.languages) &&
                        doctor.languages.map(
                          (lang, i) =>
                            lang && (
                              <span
                                key={`lang-${i}`}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                              >
                                {lang}
                              </span>
                            ),
                        )}
                    </div>
                  </div>

                  {/* Fee & Status */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {doctor.fee} ৳
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      consultation fee
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${doctor.isOnline ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${doctor.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                      ></div>
                      <span className="text-sm font-medium">
                        {doctor.isOnline ? "Online Now" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => viewDoctorDetails(doctor._id)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    View Profile
                  </button>

                  <button
                    onClick={() => openBookingModal(doctor)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Book Appointment
                  </button>

                  <button
                    onClick={() => toggleFavorite(doctor._id)}
                    className={`px-4 py-3 border rounded-lg flex items-center gap-2 ${
                      favorites.includes(doctor._id)
                        ? "border-red-300 bg-red-50 text-red-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${favorites.includes(doctor._id) ? "fill-red-400" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Favorite
                  </button>

                  <button
                    onClick={() => shareDoctor(doctor)}
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DoctorList;
