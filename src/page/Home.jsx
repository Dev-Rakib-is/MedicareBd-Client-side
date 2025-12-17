import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "../contex/AuthContex";
import api from "../api/api";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";

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

 

  return (
    <div className="container mx-auto px-4 mt-16 space-y-10">    
     <Hero/>
     <Features/>
     <HowItWorks/>
     <Testimonials/>
     <CTA/>
     <Footer/>
    </div>
  );
};

export default Home;