import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const banners = [
    {
      title: "Your Health, Our Priority",
      subtitle: "Book appointments with the best doctors — anytime, anywhere.",
      buttonText: "Book Appointment",
      image: "https://i.ibb.co/JWx8M9jD/bannerbg.jpg",
    },
    {
      title: "24/7 Emergency Services",
      subtitle: "Our team is always ready to assist you.",
      buttonText: "Contact Us",
      image: "https://i.ibb.co/KzNbvXc2/24-7-medical-call.jpg",
    },
    {
      title: "Expert Doctors",
      subtitle: "Consult with certified specialists online or offline.",
      buttonText: "See Doctors",
      image: "https://i.ibb.co/JWx8M9jD/bannerbg.jpg",
    },
  ];

  const [current, setCurrent] = useState(0);

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDoctors(true);

        const patientId = user?._id; 

        const [docRes, specRes, apptRes, prescRes, reportRes] =
          await Promise.all([
            api.get("/doctors"),
            api.get("/specializations"),
            user
              ? api.get("/appointments/patient")
              : Promise.resolve({ data: { data: [] } }),
            user
              ? api.get(`/prescriptions/${patientId}`)
              : Promise.resolve({ data: { data: [] } }),
            user
              ? api.get(`/reports/${patientId}`)
              : Promise.resolve({ data: { data: [] } }),
          ]);

        setDoctors(docRes.data?.doctors || []);
        setSpecializations(specRes.data?.specializations || []);
        setAppointments(apptRes.data?.data || []);
        setPrescriptions(prescRes.data?.data || []);
        setReports(reportRes.data?.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingDoctors(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleButton = () => {
    navigate(user ? "/doctor-details" : "/login");
  };

  if (loading) return <p className="text-center mt-16">Loading Home...</p>;

  return (
    <div className="container mx-auto px-4 mt-20 space-y-20">
      {/* Hero / Banner */}
      <motion.section
        key={current}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
        className="relative h-[70vh] flex flex-col justify-center items-center text-center bg-cover bg-center rounded"
        style={{ backgroundImage: `url(${banners[current].image})` }}
      >
        <div className="absolute inset-0 bg-black/25 rounded"></div>
        <div className="z-10 text-white max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold">
            {banners[current].title}
          </h1>
          <p className="my-4 text-lg md:text-xl">{banners[current].subtitle}</p>
          <button
            onClick={handleButton}
            className="bg-blue-600 px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            {banners[current].buttonText}
          </button>
        </div>
      </motion.section>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {user && (
          <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              <ul className="space-y-2">
                {appointments.slice(0, 3).map((appt) => (
                  <li key={appt._id} className="border-b py-1">
                    <p>
                      <strong>{appt.doctor?.name || appt.doctorId?.name}</strong>
                    </p>
                    <p>{new Date(appt.date).toLocaleString()}</p>
                    <p>Status: {appt.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {user && (
          <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Recent Prescriptions</h2>
            {prescriptions.length === 0 ? (
              <p>No prescriptions yet.</p>
            ) : (
              <ul className="space-y-2">
                {prescriptions.slice(0, 3).map((p) => (
                  <li key={p._id} className="border-b py-1">
                    <p>{p.medications.map((m) => m.name).join(", ")}</p>
                    <p>By: {p.doctor?.name || p.doctorId?.name}</p>
                    <p>{new Date(p.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {user && (
          <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Recent Reports</h2>
            {reports.length === 0 ? (
              <p>No reports found.</p>
            ) : (
              <ul className="space-y-2">
                {reports.slice(0, 3).map((r) => (
                  <li key={r._id} className="border-b py-1">
                    <p>{r.title}</p>
                    <p>{new Date(r.date).toLocaleDateString()}</p>
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {/* Top Doctors */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2 text-center">Our Doctors</h2>
        {loadingDoctors ? (
          <p>Loading doctors ...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {doctors.slice(0, 6).map((doc) => (
              <div key={doc._id} className="flex items-center gap-2 border-b py-1">
                {doc.photo_url && (
                  <img
                    src={doc.photo_url}
                    alt={doc.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-sm">{doc.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Specializations */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2 text-center">Popular Specializations</h2>
        <div className="flex flex-wrap gap-2">
          {specializations.map((sp) => (
            <span
              key={sp._id}
              className="bg-blue-200 dark:bg-blue-900 px-2 py-1 rounded text-sm"
            >
              {sp.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
