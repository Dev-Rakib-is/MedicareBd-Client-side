import { useEffect, useState } from "react";
import api from "../api/api";
import { normalizeDoctorData } from "../utils/normalizeDoctor";

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, avgRating: 4.5 });

  const [filters, setFilters] = useState({
    search: "",
    selectedSpec: "",
    selectedSort: "recommended",
    selectedAvailability: "all",
    selectedExperience: "all",
    priceRange: [0, 5000],
    viewMode: "grid"
  });

  // Fetch doctors and specializations
  const loadDoctors = async () => {
    try {
      setLoading(true);
      const [doctorRes, specRes] = await Promise.all([api.get("/doctors"), api.get("/specializations")]);

      const doctorList = Array.isArray(doctorRes.data?.doctors) ? doctorRes.data.doctors : doctorRes.data || [];
      const specList = Array.isArray(specRes.data) ? specRes.data : specRes.data?.specializations || [];

      const enhancedDoctors = doctorList.map((doc, index) => {
        const normalizedDoc = normalizeDoctorData(doc);
        return {
          ...normalizedDoc,
          rating: normalizedDoc.rating || (Math.random() * 0.5 + 4.5),
          totalReviews: normalizedDoc.totalReviews || (Math.floor(Math.random() * 100) + 50),
          nextAvailable: normalizedDoc.nextAvailable || ["Today", "Tomorrow", "In 2 days"][index % 3],
          isOnline: normalizedDoc.isOnline || (index % 3 === 0),
          isPremium: normalizedDoc.isPremium || (index % 4 === 0),
          responseTime: normalizedDoc.responseTime || `${Math.floor(Math.random() * 30) + 10} mins`
        };
      });

      setDoctors(enhancedDoctors);
      setFilteredDoctors(enhancedDoctors);
      setSpecializations(specList);
      setStats({
        total: enhancedDoctors.length,
        available: enhancedDoctors.filter(d => d.status === "APPROVED").length,
        avgRating: 4.7
      });

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDoctors(); }, []);

  const toggleFavorite = (doctorId) => {
    setFavorites(prev => prev.includes(doctorId) ? prev.filter(id => id !== doctorId) : [...prev, doctorId]);
  };

  return { doctors, filteredDoctors, setFilteredDoctors, filters, setFilters, specializations, loading, favorites, toggleFavorite, stats };
};
