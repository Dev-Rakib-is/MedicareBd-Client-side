import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const banners = [
    {
      title: "Your Health, Our Priority",
      subtitle: "Book appointments with verified doctors — anytime, anywhere.",
      buttonText: "Book Appointment",
      image: "https://i.ibb.co/JWx8M9jD/bannerbg.jpg",
    },
    {
      title: "24/7 Emergency Services",
      subtitle: "Our medical team is always ready to assist you.",
      buttonText: "Contact Us",
      image: "https://i.ibb.co/KzNbvXc2/24-7-medical-call.jpg",
    },
    {
      title: "Expert Doctors",
      subtitle: "Consult certified specialists online or offline.",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientId = user?._id;

        const [docRes, specRes, apptRes, prescRes, reportRes] =
          await Promise.all([
            api.get("/doctors"),
            api.get("/specializations"),
            user ? api.get("/appointments/patient") : Promise.resolve({ data: { data: [] } }),
            user ? api.get(`/prescriptions/${patientId}`) : Promise.resolve({ data: { data: [] } }),
            user ? api.get(`/reports/${patientId}`) : Promise.resolve({ data: { data: [] } }),
          ]);

        setDoctors(docRes.data?.doctors || []);
        setSpecializations(specRes.data?.specializations || []);
        setAppointments(apptRes.data?.data || []);
        setPrescriptions(prescRes.data?.data || []);
        setReports(reportRes.data?.data || []);
      } catch (err) {
        console.error("Home fetch error", err);
      } finally {
        setLoading(false);
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

  if (loading) return <p className="text-center mt-20">Loading Home...</p>;

  return (
    <div className="container mx-auto px-4 mt-20 space-y-20">    
     <Hero/>
     <Features/>

      {/* Top Doctors */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-6">Top Doctors</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 6).map((doc) => (
            <div key={doc._id} className="bg-white rounded-xl shadow p-4">
              <img
                src={doc.photo_url || "/doctor-placeholder.png"}
                alt={doc.name}
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
              <h3 className="text-lg font-semibold text-center mt-3">{doc.name}</h3>
              <p className="text-center text-sm text-gray-500">{doc.specialization}</p>
              <button
                onClick={() => navigate(`/doctor/${doc._id}`)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-6">Popular Specializations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {specializations.map((sp) => (
            <div key={sp._id} className="bg-white p-4 rounded-xl shadow text-center">
              <p className="font-medium">{sp.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logged-in Patient Info */}
      {user && (
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Upcoming Appointments</h3>
            {appointments.length === 0 ? <p>No appointments</p> : appointments.slice(0, 3).map(a => (
              <p key={a._id} className="text-sm">{new Date(a.date).toLocaleString()}</p>
            ))}
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Prescriptions</h3>
            {prescriptions.length === 0 ? <p>No prescriptions</p> : prescriptions.slice(0, 3).map(p => (
              <p key={p._id} className="text-sm">{p.medications?.[0]?.name}</p>
            ))}
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Reports</h3>
            {reports.length === 0 ? <p>No reports</p> : reports.slice(0, 3).map(r => (
              <a key={r._id} href={r.file_url} className="text-blue-600 text-sm block">{r.title}</a>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-10 text-center">
        <h2 className="text-3xl font-bold">Need a Doctor Today?</h2>
        <p className="mt-3 opacity-90">Book your appointment in less than 1 minute</p>
        <button
          onClick={handleButton}
          className="mt-6 bg-white text-blue-700 px-8 py-3 rounded-full font-semibold"
        >
          Book Appointment
        </button>
      </section>
    </div>
  );
};

export default Home;