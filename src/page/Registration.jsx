import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../contex/AuthContex";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/api";
import { Navigate, useNavigate } from "react-router";

export const Registration = () => {
  const { loading } = useAuth();
  const [tab, setTab] = useState("PATIENT");
  const Navigate = useNavigate();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [specialization, setSpecialization] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch specializations from backend
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/specializations");
        setSpecialization(res.data);
      } catch (error) {
        console.log("Error fetching specializations:", error);
      }
    };
    fetchSpecializations();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (!name)
      return Swal.fire("Missing Name!", "Type Your Full Name", "warning");
    if (!email || !emailRegex.test(email))
      return Swal.fire(
        "Invalid Email!",
        "Email is either empty or invalid",
        "warning"
      );
    if (!password)
      return Swal.fire(
        "Missing Password!",
        "Please enter your password",
        "warning"
      );
    if (!age || age < 0 || age > 120)
      return Swal.fire(
        "Invalid Age!",
        "Please type your correct age",
        "warning"
      );
    if (!gender)
      return Swal.fire("Missing Gender!", "Select your gender", "warning");
    if (tab === "DOCTOR" && !specialist)
      return Swal.fire(
        "Missing Specialization!",
        "Select your specialization",
        "warning"
      );

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("age", age);
      formData.append("gender", gender);

      if (tab === "DOCTOR") formData.append("specialization", specialist);
      if (photoUrl) formData.append("photo", photoUrl);

      // Backend endpoint based on tab
      const endpoint =
        tab === "PATIENT" ? "/auth/register/patient" : "/auth/register/doctor";

      const res = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success!", "Registration Successful!", "success");
      Navigate("/login");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <section className="h-screen flex justify-center items-center bg-gray-200 dark:bg-black p-4">
      <div className="p-8 rounded bg-white dark:bg-gray-900 w-full max-w-md shadow-md">
        <h2 className="text-center text-2xl dark:text-white">Create Account</h2>

        {/* Tab selection */}
        <div className="flex gap-2 my-4 justify-center">
          <button
            onClick={() => setTab("PATIENT")}
            className={`cursor-pointer px-4 py-2 rounded ${
              tab === "PATIENT"
                ? "text-white bg-blue-600"
                : "text-black/90 bg-gray-200"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setTab("DOCTOR")}
            className={`cursor-pointer px-4 py-2 rounded ${
              tab === "DOCTOR"
                ? "text-white bg-blue-600"
                : "text-black/90 bg-gray-200"
            }`}
          >
            Doctor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input-box dark:placeholder-white/70"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input-box dark:placeholder-white/70"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-box dark:placeholder-white/70"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 dark:text-white"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            className="input-box dark:placeholder-white/70"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="input-box dark:placeholder-white/70"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option>Male</option>
            <option>Female</option>
            <option>Others</option>
          </select>

          {tab === "DOCTOR" && (
            <select
              className="input-box dark:placeholder-white/70"
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
            >
              <option value="" disabled>
                Select Specialization
              </option>
              {specialization.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="file"
            onChange={(e) => setPhotoUrl(e.target.files[0])}
            className="input-box dark:placeholder-white/70"
          />

          <motion.button
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="text-lg font-semibold bg-green-600 text-white/90 border px-3 py-2 rounded cursor-pointer shadow-md w-full"
          >
            {loading ? "Registering..." : "Submit"}
          </motion.button>
        </form>
      </div>
    </section>
  );
};
