import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [waveOffset, setWaveOffset] = useState(0);

  // Animate counting up
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({ doctors: 250, patients: 10000, appointments: 50000 });
    }, 500);
    
    // Wave animation
    const waveInterval = setInterval(() => {
      setWaveOffset(prev => (prev + 1) % 100);
    }, 50);
    
    return () => {
      clearTimeout(timer);
      clearInterval(waveInterval);
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <div>
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full mb-6 shadow-sm"
            >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={16} />
          </motion.div>
              <span className="font-medium">Tritmo</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Find & Book
              <span className="block text-blue-600 mt-2">Expert Doctors</span>
            </motion.h1>
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-lg text-gray-600 mb-8 max-w-lg"
            >
              Connect instantly with certified doctors. Book appointments, 
              video consultations, and manage your health—all in one place.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-wrap gap-6 mb-8"
            >
              {[
                { icon: <Users size={20} />, value: stats.doctors, label: "Doctors", color: "text-blue-600" },
                { icon: <Users size={20} />, value: stats.patients, label: "Patients", color: "text-green-600" },
                { icon: <Calendar size={20} />, value: stats.appointments, label: "Appointments", color: "text-purple-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-2xl font-bold ${stat.color} flex items-center justify-center gap-2`}>
                    {stat.icon}
                    <motion.span
                      key={stat.value}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {stat.value.toLocaleString()}+
                    </motion.span>
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <button
                onClick={() => navigate("/doctors")}
                className="group relative bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 overflow-hidden"
              >
                {/* White overlay animation */}
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                <span>Book Appointment</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key="arrow"
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight size={18} />
                  </motion.div>
                </AnimatePresence>
              </button>

              <button
                onClick={() => navigate("/doctors")}
                className="group relative border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-bold transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative">View Doctors</span>
              </button>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-4 text-sm text-gray-600"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <Clock size={16} className="text-green-500" />
                <span>24/7 Available</span>
              </motion.div>
              <div className="w-px h-4 bg-gray-300"></div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <Calendar size={16} className="text-purple-500" />
                <span>Instant Booking</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-1 shadow-2xl">
              <div className="bg-white rounded-xl p-6">
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-40 h-40 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-6"
                  >
                    <div className="text-5xl">👨‍⚕️</div>
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Dr. Abdullah Amin</h3>
                  <p className="text-blue-600 font-medium mb-4">Dentist Specialist</p>
                  
                  {/* Availability */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Today Available:</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-green-600 font-bold">✓</span>
                      </motion.div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                      {['10:00', '12:00', '3:00', '5:00'].map((time, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.1 }}
                          className="bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded text-sm cursor-pointer hover:bg-blue-50"
                        >
                          {time}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg font-bold transition-all shadow-md"
                  >
                    Book This Doctor
                  </motion.button>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              <span className="font-bold">⭐4.9</span>
              <span className="text-sm ml-2">Rating</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-32">
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
              d: `M0,${60 + Math.sin(waveOffset * 0.1) * 10} C240,${40 + Math.sin(waveOffset * 0.1 + 1) * 10} 480,${20 + Math.sin(waveOffset * 0.1 + 2) * 10} 720,${40 + Math.sin(waveOffset * 0.1 + 3) * 10} C960,${60 + Math.sin(waveOffset * 0.1 + 4) * 10} 1200,${40 + Math.sin(waveOffset * 0.1 + 5) * 10} 1440,${60 + Math.sin(waveOffset * 0.1 + 6) * 10} L1440,120 L0,120 Z`
            }}
            transition={{ duration: 0.1 }}
          />
          
          {/* Second wave layer */}
          <motion.path
            d="M0,70 C240,50 480,30 720,50 C960,70 1200,50 1440,70 L1440,120 L0,120 Z"
            fill="#60A5FA"
            fillOpacity="0.05"
            animate={{ 
              d: `M0,${70 + Math.sin(waveOffset * 0.1 + 0.5) * 8} C240,${50 + Math.sin(waveOffset * 0.1 + 1.5) * 8} 480,${30 + Math.sin(waveOffset * 0.1 + 2.5) * 8} 720,${50 + Math.sin(waveOffset * 0.1 + 3.5) * 8} C960,${70 + Math.sin(waveOffset * 0.1 + 4.5) * 8} 1200,${50 + Math.sin(waveOffset * 0.1 + 5.5) * 8} 1440,${70 + Math.sin(waveOffset * 0.1 + 6.5) * 8} L1440,120 L0,120 Z`
            }}
            transition={{ duration: 0.1 }}
          />
        </svg>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-300 rounded-full"
          initial={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
          }}
          animate={{
            y: [null, '-20px', '20px', '0px'],
            x: [null, '10px', '-10px', '0px'],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

export default Hero;