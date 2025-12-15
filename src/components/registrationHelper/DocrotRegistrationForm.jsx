import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router";

export default function DoctorRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specializationId: "",
    fee: "",
    photo: null, 
    termsAccepted: false, 
  });

  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔹 specialization
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await api.get("/departments");
        setSpecializations(res.data.data || res.data);
      } catch (err) {
        console.error("Failed to load specializations");
      }
    };
    fetchSpecializations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.termsAccepted) {
      setError("You must accept the Terms & Conditions");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("specialization", formData.specializationId);
      data.append("fee", formData.fee || 0);
      data.append("termsAccepted", formData.termsAccepted);
      if (formData.photo) data.append("photo", formData.photo); // <-- attach photo

      const res = await api.post("/doctors/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setSuccess("Doctor registered successfully. Wait for admin approval.");
        setFormData({
          name: "",
          email: "",
          password: "",
          specializationId: "",
          fee: "",
          photo: null,
          termsAccepted: false,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const design = {
    lable: "block text-gray-700 font-medium mb-2",
    input:
      "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-0",
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      {/* Heading  */}
      <div>
        <h2 className="text-2xl font-bold mb-2 text-center">
          Doctor Registration
        </h2>

        <p className="text-center mb-4 text-black/70">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login here
          </Link>
        </p>
      </div>

      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={design.lable}>Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={design.input}
          />
        </div>

        <div>
          <label className={design.lable}>Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={design.input}
          />
        </div>

        <div>
          <label className={design.lable}>Password *</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={design.input}
          />
        </div>

        {/* 🔹 Specialization */}
        <div>
          <label className={design.lable}>Specialization *</label>
          <select
            name="specializationId"
            value={formData.specializationId}
            onChange={handleChange}
            required
            className={design.input}
          >
            <option value="">Select Specialization</option>
            {specializations.map((sp) => (
              <option key={sp._id} value={sp._id}>
                {sp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fee */}
        <div>
          <label className={design.lable}>Consultation Fee *</label>
          <input
            type="number"
            name="fee"
            placeholder="Consultation Fee"
            value={formData.fee}
            onChange={handleChange}
            required
            className={design.input}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className={design.lable}>Profile Photo (optional)</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className={design.input}
          />
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label className="text-gray-700 text-sm">
            I accept the{" "}
            <Link to="/terms" className="text-blue-600 underline">
              Terms & Conditions
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white p-2 rounded font-bold ${
            loading ? "cursor-not-allowed bg-blue-300" : "bg-blue-600"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
