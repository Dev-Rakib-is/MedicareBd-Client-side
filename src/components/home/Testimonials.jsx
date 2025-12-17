const testimonials = [
  {
    name: "Dr. Ahsan Rahman",
    role: "Senior Cardiologist, Apollo Hospitals",
    message:
      "Tritmo has revolutionized how I manage my practice. Appointment scheduling is 70% faster, patient no-shows reduced by 40%, and my administrative workload has been cut in half. The platform's intuitive design makes it a pleasure to use every day.",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    highlight: true,
    stats: [
      { value: "40%", label: "Less No-shows" },
      { value: "70%", label: "Faster Scheduling" }
    ],
    verified: true
  },
  {
    name: "Nusrat Jahan",
    role: "Patient (Diabetes Management)",
    message:
      "As someone who needs regular check-ups, Tritmo has been a lifesaver. Booking specialists used to take weeks; now I get appointments within 24 hours. The medication reminders and virtual consultations saved me countless trips to the hospital during lockdown.",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    highlight: false,
    stats: [
      { value: "24h", label: "Avg. Booking Time" },
      { value: "95%", label: "Time Saved" }
    ],
    verified: true
  },
  {
    name: "Dr. Mahmud Hasan",
    role: "Chief Dermatologist, SkinCare Plus",
    message:
      "Our clinic has seen a 60% increase in patient retention since switching to Tritmo. The integrated patient records system and automated follow-ups have dramatically improved our service quality. It's more than software—it's a practice management partner.",
    avatar: "https://i.pravatar.cc/150?img=45",
    rating: 5,
    highlight: false,
    stats: [
      { value: "60%", label: "Retention Boost" },
      { value: "4.9", label: "Patient Rating" }
    ],
    verified: true
  },
  {
    name: "Tasnim Ahmed",
    role: "IT Manager, City Medical Group",
    message:
      "Implementing Tritmo across our 12 clinics was seamless. The API integration with our existing EMR system took only 3 days. Our doctors love the interface, and patients appreciate the convenience. Support team is exceptionally responsive.",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 4.5,
    highlight: false,
    stats: [
      { value: "12", label: "Clinics" },
      { value: "3 Days", label: "Integration" }
    ],
    verified: true
  },
  {
    name: "Dr. Fatima Begum",
    role: "Pediatrician, ChildCare Specialists",
    message:
      "The pediatric module is exceptional. Vaccine tracking, growth charts, and parent communication features are tailored perfectly for pediatric care. My young patients' parents find the platform incredibly easy to use.",
    avatar: "https://i.pravatar.cc/150?img=51",
    rating: 5,
    highlight: true,
    stats: [
      { value: "200+", label: "Happy Parents" },
      { value: "100%", label: "Vaccine Tracking" }
    ],
    verified: true
  },
  {
    name: "Rahim Khan",
    role: "Healthcare Investor",
    message:
      "Having evaluated dozens of healthcare platforms, Tritmo stands out for its execution. The user metrics speak for themselves: 98% satisfaction rate, 85% feature adoption, and consistent month-over-month growth. A solid investment in healthcare tech.",
    avatar: "https://i.pravatar.cc/150?img=67",
    rating: 5,
    highlight: false,
    stats: [
      { value: "98%", label: "Satisfaction" },
      { value: "85%", label: "Adoption" }
    ],
    verified: true
  }
];

export default function Testimonials() {
  return (
    <section className="relative bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-green-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
      
      {/* Floating Quotes */}
      <div className="absolute top-20 left-10 text-6xl text-blue-100/40">❝</div>
      <div className="absolute bottom-20 right-10 text-6xl text-green-100/40">❞</div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
            </div>
            <span className="text-sm font-bold text-blue-700">4.9/5 from 2,500+ reviews</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Join Our Growing Community50+ Medical Professionals
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            See why thousands of doctors and patients choose Tritmo for their healthcare journey
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">50K+</div>
            <div className="text-gray-600 mt-2">Monthly Appointments</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">98%</div>
            <div className="text-gray-600 mt-2">Patient Satisfaction</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">250+</div>
            <div className="text-gray-600 mt-2">Doctors Registered</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">24/7</div>
            <div className="text-gray-600 mt-2">Support Available</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`
                group relative rounded-3xl p-8 transition-all duration-500
                ${item.highlight 
                  ? "md:col-span-2 lg:col-span-1 bg-gradient-to-br from-white to-blue-50 shadow-2xl border-0" 
                  : "bg-white/90 backdrop-blur-sm shadow-xl border border-gray-100"
                }
                hover:shadow-2xl hover:-translate-y-2
              `}
            >
              {/* Highlight Badge */}
              {item.highlight && (
                <div className="absolute -top-3 left-8">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg">
                    FEATURED REVIEW
                  </span>
                </div>
              )}
              
              {/* Verified Badge */}
              {item.verified && (
                <div className="absolute top-8 right-8 flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 border border-green-100">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-medium text-green-700">Verified</span>
                </div>
              )}

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`
                      text-xl ${i < Math.floor(item.rating) 
                        ? "text-yellow-400" 
                        : i < item.rating 
                          ? "text-yellow-300" 
                          : "text-gray-200"
                      }
                    `}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm font-semibold text-gray-700 ml-2">{item.rating}</span>
              </div>

              {/* Message */}
              <p className="text-gray-700 leading-relaxed mb-8 text-sm">
                "{item.message}"
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-6">
                {item.stats.map((stat, idx) => (
                  <div key={idx} className="flex-1 text-center p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="relative">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.role}</p>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}