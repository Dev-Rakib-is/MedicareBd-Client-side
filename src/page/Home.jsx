import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";

import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (loading) return;

    const fetchData = async () => {
      try {
        const requests = [
          api.get("/doctors"),
          api.get("/specializations"),
        ];

        // ROLE BASED REQUESTS
        if (user?.role === "PATIENT") {
          requests.push(api.get("/appointments/patient"));
          requests.push(api.get(`/prescriptions/${user._id}`));
          requests.push(api.get(`/reports/${user._id}`));
        }

        if (user?.role === "DOCTOR") {
          requests.push(api.get("/appointments/doctor"));
        }

        const responses = await Promise.all(requests);

        setDoctors(responses[0]?.data?.doctors || []);
        setSpecializations(responses[1]?.data?.specializations || []);

        if (user?.role === "PATIENT") {
          setAppointments(responses[2]?.data?.data || []);
          setPrescriptions(responses[3]?.data?.data || []);
          setReports(responses[4]?.data?.data || []);
        }

        if (user?.role === "DOCTOR") {
          setAppointments(responses[2]?.data?.data || []);
        }
      } catch (err) {
        console.error("Home fetch error:", err);
      }
    };

    fetchData();
  }, [user, loading]);

  /* ================= HANDLER ================= */
  const handleButton = () => {
    navigate(user ? "/doctor-details" : "/login");
  };

  return (
    <div className="container mx-auto px-4 mt-16 space-y-10">
      <Hero onAction={handleButton} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
