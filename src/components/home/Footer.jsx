import { Link } from "react-router-dom";
import { FaApple, FaGooglePlay, FaHeartbeat } from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-300 overflow-hidden py-20">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <FaHeartbeat className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Tritmo<span className="text-blue-600 animate-ping">.</span>
                </h2>
                <p className="text-xs text-blue-300 font-semibold">
                  HEALTHCARE REIMAGINED
                </p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-md">
              We're revolutionizing healthcare delivery through technology.
              Connecting patients with trusted medical professionals for
              seamless, secure, and efficient healthcare experiences.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700">
                <SiTrustpilot className="text-yellow-400" />
                <span className="text-xs font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-lg mb-6 pb-2 border-b border-gray-800">
              For Patients
            </h4>
            <ul className="space-y-3">
              {[
                "Find Doctors",
                "Book Appointments",
                "Video Consultation",
                "Prescription Refill",
                "Health Records",
                "Emergency Care",
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-blue-500"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Doctors */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-lg mb-6 pb-2 border-b border-gray-800">
              For Doctors
            </h4>
            <ul className="space-y-3">
              {[
                "Join Our Network",
                "Practice Dashboard",
                "Patient Management",
                "Telemedicine Setup",
                "Earnings & Reports",
                "Schedule Management",
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={`/doctors/${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-purple-500"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold text-lg mb-6 pb-2 border-b border-gray-800">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Careers",
                "Press & Media",
                "Blog",
                "Success Stories",
                "Partnerships",
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Download Section */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 my-12 border border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Download Our App
              </h3>
              <p className="text-gray-400">
                Book appointments, track health, and consult doctors on the go
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl flex items-center gap-3">
                <FaApple className="text-2xl" />
                <span className="font-bold">App Store</span>
              </button>
              <button className="px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl flex items-center gap-3">
                <FaGooglePlay className="text-xl" />
                <span className="font-bold">Google Play</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Tritmo Healthcare Technologies. All rights reserved.
          </p>

          <div className="flex gap-6">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Cookie Policy",
              "Disclaimer",
              "Sitemap",
            ].map((item, idx) => (
              <Link
                key={idx}
                to={`/${item.toLowerCase()}`}
                className="text-gray-500 hover:text-white text-sm"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
