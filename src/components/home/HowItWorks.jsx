const steps = [
  {
    step: "01",
    title: "Search & Find Doctor",
    description:
      "Use our AI-powered search to find verified doctors by specialty, location, ratings, or availability within seconds.",
    icon: "🔍",
    gradient: "from-blue-500 to-cyan-400",
    features: ["AI Recommendations", "Filter by Specialty", "Read Reviews", "Check Availability"],
    time: "30 Seconds"
  },
  {
    step: "02",
    title: "Book Smart Appointment",
    description:
      "Select your preferred time slot, choose consultation type (in-person/virtual), and confirm instantly with secure payment.",
    icon: "📅",
    gradient: "from-purple-500 to-pink-500",
    features: ["Instant Booking", "Multiple Payment Options", "Insurance Check", "Reminder Setup"],
    time: "1 Minute"
  },
  {
    step: "03",
    title: "Visit & Get Premium Care",
    description:
      "Meet your doctor with digital check-in, share health records securely, and receive personalized treatment plans.",
    icon: "🩺",
    gradient: "from-green-500 to-emerald-400",
    features: ["Digital Check-in", "Health Record Sharing", "Virtual Waiting Room", "Follow-up Plans"],
    time: "Zero Wait Time"
  },
  {
    step: "04",
    title: "Post-Visit Care & Follow-up",
    description:
      "Access digital prescriptions, schedule follow-ups, track recovery, and receive wellness recommendations.",
    icon: "📱",
    gradient: "from-orange-500 to-yellow-400",
    features: ["E-Prescriptions", "Recovery Tracking", "Follow-up Scheduling", "Wellness Tips"],
    time: "Continuous Support"
  }
];

export default function HowItWorks() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      {/* Connecting Lines Container */}
      <div className="absolute top-1/2 left-0 right-0 hidden lg:block">
        <div className="max-w-5xl mx-auto px-16">
          <div className="h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            SIMPLE 4-STEP PROCESS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Healthcare Made{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Effortless
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            From finding the right doctor to post-visit care — all in one seamless journey.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4 relative">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Step Number with Connector */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  {/* Step Number Circle */}
                  <div className={`
                    relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center
                    bg-gradient-to-br ${item.gradient} shadow-xl
                    group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500
                  `}>
                    <span className="text-white text-xl font-bold">{item.step}</span>
                    
                    {/* Time Badge */}
                    <div className="absolute -top-2 -right-2 px-3 py-1 bg-white rounded-full shadow-lg border border-gray-100">
                      <span className="text-xs font-bold text-gray-700">{item.time}</span>
                    </div>
                  </div>
                  
                  {/* Connector Lines for Desktop */}
                  {index < steps.length - 1 && (
                    <>
                      <div className="hidden lg:block absolute left-full top-1/2 w-24 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 z-0"></div>
                      <div className="hidden lg:block absolute left-full top-1/2 w-2 h-2 rounded-full bg-blue-400 transform -translate-y-1/2 ml-24"></div>
                    </>
                  )}
                </div>
              </div>

              {/* Step Card */}
              <div className={`
                relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100
                hover:shadow-2xl hover:-translate-y-3 transition-all duration-500
                h-full
              `}>
                {/* Icon Container */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 mb-6">
                  <span className="text-2xl">{item.icon}</span>
                </div>

                {/* Title & Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">INCLUDES:</h4>
                    <ul className="space-y-2">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>

              {/* Mobile Connector (only between steps) */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center mt-8">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-blue-200 to-purple-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}