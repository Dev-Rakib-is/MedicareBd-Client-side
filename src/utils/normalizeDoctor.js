export const normalizeDoctorData = (doctor) => {
  return {
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
  };
};
