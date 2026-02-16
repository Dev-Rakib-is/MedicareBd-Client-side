import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../api/api";

const Hero = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
  });
  const [waveOffset, setWaveOffset] = useState(0);
  const [featuredDoctor, setFeaturedDoctor] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({ doctors: 250, patients: 10000, appointments: 50000 });
    }, 500);

    const waveInterval = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 100);
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(waveInterval);
    };
  }, []);

  useEffect(() => {
    const fetchFeaturedDoctor = async () => {
      try {
        const res = await api.get("/doctors/featured");
        if (res.data.success && res.data.doctors.length > 0) {
          setFeaturedDoctor(res.data.doctors[0]);
        }
      } catch (err) {
        console.error("Failed to fetch featured doctor", err);
      }
    };
    fetchFeaturedDoctor();
  }, []);

  // ✅ FIXED: Helper function to get specialization name
  const getSpecializationName = (spec) => {
    if (!spec) return "Medical Specialist";
    if (typeof spec === 'object') {
      return spec.name || "Medical Specialist";
    }
    return spec;
  };

  const calculateRemainingDays = (featuredUntil) => {
    if (!featuredUntil) return "Featured";
    const now = new Date();
    const endDate = new Date(featuredUntil);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Ended";
    if (diffDays === 1) return "1 day left";
    if (diffDays <= 7) return `${diffDays} days left`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks left`;
    return "1 month+ left";
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={16} />
              </motion.div>
              <span className="font-medium">Tritmo</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Find & Book
              <span className="block text-blue-600 mt-2">Expert Doctors</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-gray-600 mb-8 max-w-lg"
            >
              Connect instantly with certified doctors. Book appointments, video
              consultations, and manage your health—all in one place.
            </motion.p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                {
                  icon: <Users size={20} />,
                  value: stats.doctors,
                  label: "Doctors",
                  color: "text-blue-600",
                },
                {
                  icon: <Users size={20} />,
                  value: stats.patients,
                  label: "Patients",
                  color: "text-green-600",
                },
                {
                  icon: <Calendar size={20} />,
                  value: stats.appointments,
                  label: "Appointments",
                  color: "text-purple-600",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`text-2xl font-bold ${stat.color} flex items-center justify-center gap-2`}
                  >
                    {stat.icon}
                    <span>{stat.value.toLocaleString()}+</span>
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => navigate("/doctors/patient?from=booking")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
              >
                <span>Book Appointment</span>
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </button>
              <button
                onClick={() => navigate("/doctors/patient")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-bold transition-colors"
              >
                View Doctors
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-green-500" />
                <span>24/7 Available</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-purple-500" />
                <span>Instant Booking</span>
              </div>
            </div>
          </div>

          {/* Right Featured Doctor Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            {/* Featured Countdown Badge */}
            {featuredDoctor?.isFeatured && (
              <div className="absolute -top-3 -right-3 z-10">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full shadow-lg font-bold flex items-center gap-2 text-sm">
                  <Sparkles size={12} />
                  <span>
                    {featuredDoctor.featuredUntil
                      ? calculateRemainingDays(featuredDoctor.featuredUntil)
                      : "Featured"}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-1 shadow-2xl">
              <div className="bg-white rounded-xl p-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-40 h-40 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-6">
                    <div className="text-5xl">👨‍⚕️</div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {featuredDoctor ? featuredDoctor.name : "Featured Doctor"}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {featuredDoctor
                      ? getSpecializationName(featuredDoctor.specialization)
                      : "Medical Specialist"}
                  </p>

                  {featuredDoctor?.status === "PENDING" && (
                    <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold mb-3">
                      Fresher
                    </span>
                  )}

                  {featuredDoctor && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Available:
                        </span>
                        <span className="text-green-600 font-bold">
                          {featuredDoctor.workingHours 
                            ? `${featuredDoctor.workingHours?.from || 'N/A'} - ${featuredDoctor.workingHours?.to || 'N/A'}`
                            : "Check Schedule"}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      featuredDoctor &&
                      navigate(`/book-appointment/${featuredDoctor._id}`)
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg font-bold transition-colors shadow-md"
                  >
                    {featuredDoctor ? "Book This Doctor" : "View All Doctors"}
                  </button>
                </div>
              </div>
            </div>

            {featuredDoctor && (
              <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-lg">
                <span className="font-bold">
                  ⭐{featuredDoctor.rating || 4.9}
                </span>
                <span className="text-xs ml-1">Rating</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-24">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,60 C240,40 480,20 720,40 C960,60 1200,40 1440,60 L1440,120 L0,120 Z"
            fill="#3B82F6"
            fillOpacity="0.1"
            animate={{
              d: `M0,${60 + Math.sin(waveOffset * 0.1) * 10} C240,${
                40 + Math.sin(waveOffset * 0.1 + 1) * 10
              } 480,${20 + Math.sin(waveOffset * 0.1 + 2) * 10} 720,${
                40 + Math.sin(waveOffset * 0.1 + 3) * 10
              } C960,${60 + Math.sin(waveOffset * 0.1 + 4) * 10} 1200,${
                40 + Math.sin(waveOffset * 0.1 + 5) * 10
              } 1440,${
                60 + Math.sin(waveOffset * 0.1 + 6) * 10
              } L1440,120 L0,120 Z`,
            }}
            transition={{ duration: 0.1 }}
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;