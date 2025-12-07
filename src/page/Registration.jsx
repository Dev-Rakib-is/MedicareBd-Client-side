import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../contex/AuthContex";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export const Registration = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("PATIENT");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    specialist: "",
    photoFile: null,
  });
  const [specialization, setSpecialization] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/specializations");
        setSpecialization(res.data);
      } catch (err) {
        console.error("Error fetching specializations:", err);
      }
    };
    fetchSpecializations();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password, age, gender, specialist, photoFile } = form;

    // Validations
    if (!name) return Swal.fire("Missing Name!", "Type your full name", "warning");
    if (!email) return Swal.fire("Missing Email!", "Type your email", "warning");
    if (!password) return Swal.fire("Missing Password!", "Enter your password", "warning");
    if (!age || age < 0 || age > 120) return Swal.fire("Invalid Age!", "Enter valid age", "warning");
    if (!gender) return Swal.fire("Missing Gender!", "Select your gender", "warning");
    if (tab === "DOCTOR" && !specialist) return Swal.fire("Missing Specialization!", "Select your specialization", "warning");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("age", age);
      formData.append("gender", gender);
      if (tab === "DOCTOR") formData.append("specialization", specialist);
      if (photoFile) formData.append("photo", photoFile);

      const endpoint = tab === "PATIENT" ? "/auth/register/patient" : "/auth/register/doctor";

      const res = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Success!", "Registration Successful!", "success");
      navigate("/login");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  return (
    <section className="h-screen flex justify-center items-center bg-gray-200 dark:bg-black p-4">
      <div className="p-8 rounded bg-white dark:bg-gray-900 w-full max-w-md shadow-md">
        <h2 className="text-center text-2xl dark:text-white mb-4">Create Account</h2>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-4 justify-center">
          {["PATIENT", "DOCTOR"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded ${tab === t ? "bg-blue-600 text-white" : "bg-gray-200 text-black/90"}`}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="input-box dark:placeholder-white/70"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-box dark:placeholder-white/70"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
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
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Age"
            className="input-box dark:placeholder-white/70"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="input-box dark:placeholder-white/70"
          >
            <option value="" disabled>Select Gender</option>
            {["Male", "Female", "Others"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {tab === "DOCTOR" && (
            <select
              name="specialist"
              value={form.specialist}
              onChange={handleChange}
              className="input-box dark:placeholder-white/70"
            >
              <option value="" disabled>Select Specialization</option>
              {specialization.map((s) => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
          )}

          <input
            type="file"
            name="photoFile"
            onChange={handleChange}
            className="input-box dark:placeholder-white/70"
          />

          <motion.button
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 px-3 rounded bg-green-600 text-white shadow-md font-semibold"
          >
            {loading ? "Registering..." : "Submit"}
          </motion.button>
        </form>
      </div>
    </section>
  );
};
