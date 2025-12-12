const PremiumBanner = () => {
  const features = [
    "Priority booking with top doctors",
    "Video consultations 24/7",
    "Exclusive health checkup packages",
    "No waiting time for appointments",
    "Personal health assistant"
  ];

  return (
    <div className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Upgrade to Premium</h3>
            </div>
            
            <p className="opacity-90 mb-6 max-w-2xl">
              Get exclusive access to premium features and elevate your healthcare experience.
            </p>
            
            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold">৳ 999<span className="text-lg font-normal">/month</span></div>
                <p className="text-sm opacity-80 mt-2">Cancel anytime</p>
              </div>
              
              <button
                onClick={() => alert('Redirecting to premium subscription...')}
                className="w-full px-8 py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Start Free Trial
              </button>
              
              <p className="text-center text-sm opacity-80 mt-4">
                7-day free trial, then ৳ 999/month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;