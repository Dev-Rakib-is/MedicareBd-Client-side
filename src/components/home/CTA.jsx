import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Book Your Doctor Appointment in Minutes
        </h2>

        {/* Sub text */}
        <p className="mt-4 text-blue-100 max-w-2xl mx-auto text-base md:text-lg">
          Tritmo helps you find verified doctors, schedule appointments,
          and manage your health effortlessly — anytime, anywhere.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/book-appointment"
            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition"
          >
            Book Appointment
          </Link>

          <Link
            to="/registration"
            className="px-8 py-4 border border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition"
          >
            Join as Doctor
          </Link>
        </div>
      </div>

      {/* Background Blur Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
    </section>
  );
}
