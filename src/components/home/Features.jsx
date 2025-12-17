const features = [
  {
    title: "Easy Doctor Booking",
    description:
      "Book appointments with verified doctors in just a few clicks. No long waiting lines.",
    icon: "🩺",
    gradient: "from-blue-500 to-cyan-400",
    stat: "98% satisfaction",
    highlight: true
  },
  {
    title: "Smart Schedule AI",
    description:
      "AI-powered scheduling finds the perfect time slots based on your preferences and doctor availability.",
    icon: "🤖",
    gradient: "from-purple-500 to-pink-500",
    stat: "40% faster booking",
    highlight: true
  },
  {
    title: "Secure Patient Data",
    description:
      "HIPAA-compliant encryption ensures your medical information is protected with military-grade security.",
    icon: "🔒",
    gradient: "from-green-500 to-emerald-400",
    stat: "Zero breaches",
  },
  {
    title: "Instant Notifications",
    description:
      "Smart reminders, updates for appointments, cancellations, and prescription alerts in real-time.",
    icon: "🔔",
    gradient: "from-orange-500 to-yellow-400",
    stat: "99.9% delivery rate",
  },
  {
    title: "Video Consultations",
    description:
      "High-quality virtual appointments with specialists from anywhere, saving you travel time.",
    icon: "📹",
    gradient: "from-red-500 to-rose-400",
    stat: "500k+ consults",
  },
  {
    title: "Health Records Sync",
    description:
      "Centralized digital health records that sync across hospitals and clinics seamlessly.",
    icon: "📋",
    gradient: "from-indigo-500 to-blue-400",
    stat: "1M+ records",
  },
  {
    title: "Prescription Manager",
    description:
      "Digital prescriptions, refill reminders, and pharmacy integration for hassle-free medication.",
    icon: "💊",
    gradient: "from-teal-500 to-cyan-400",
    stat: "Auto-refills",
  },
  {
    title: "Wellness Tracking",
    description:
      "Monitor vitals, set health goals, and get personalized wellness recommendations daily.",
    icon: "📊",
    gradient: "from-violet-500 to-purple-400",
    stat: "24/7 monitoring",
  },
];

export default function Features() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold mb-4">
            WHY CHOOSE TRITMO
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Healthcare
            </span>{" "}
            Reimagined with Technology
          </h2>
          <p className="text-xl text-gray-600">
            Experience healthcare that&apos;s faster, smarter, and more connected than ever before.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-blue-600">500K+</div>
            <div className="text-gray-600">Patients Served</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-purple-600">250+</div>
            <div className="text-gray-600">Verified Doctors</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-green-600">99.7%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-3xl font-bold text-orange-600">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
                {/* Premium Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                group relative rounded-3xl p-8 transition-all duration-500
                ${feature.highlight 
                  ? "lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-white to-gray-50 shadow-2xl border-0" 
                  : "bg-white shadow-xl border border-gray-100 hover:shadow-2xl"
                }
                hover:-translate-y-2
              `}
            >
              {/* Highlight Badge */}
              {feature.highlight && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              {/* Icon Container */}
              <div className={`
                inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                bg-gradient-to-br ${feature.gradient} shadow-lg
                group-hover:scale-110 transition-transform duration-300
              `}>
                <span className="text-2xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <div className={feature.highlight ? "space-y-4" : "space-y-3"}>
                <h3 className={`
                  font-bold ${feature.highlight ? "text-2xl" : "text-xl"}
                  text-gray-900 group-hover:text-transparent group-hover:bg-clip-text
                  group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600
                `}>
                  {feature.title}
                </h3>
                
                <p className={`
                  ${feature.highlight ? "text-gray-700 text-base" : "text-gray-600 text-sm"}
                  leading-relaxed
                `}>
                  {feature.description}
                </p>
                
                {/* Stat Badge */}
                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    {feature.stat}
                  </span>
                </div>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}