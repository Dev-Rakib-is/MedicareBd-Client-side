import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

const DAYS = [
  { label: "Sun", value: "SUN" },
  { label: "Mon", value: "MON" },
  { label: "Tue", value: "TUE" },
  { label: "Wed", value: "WED" },
  { label: "Thu", value: "THU" },
  { label: "Fri", value: "FRI" },
  { label: "Sat", value: "SAT" },
];

export default function DoctorRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    registrationNumber: "",
    fee: "",
    workingDays: [],
    workingHours: { from: "", to: "" },
    photo: null,
    termsAccepted: false,
  });

  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api
      .get("/specializations")
      .then((res) => {
        setSpecializations(res.data?.data || res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch specializations:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else if (name.startsWith("workingHours.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        workingHours: {
          ...formData.workingHours,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const toggleDay = (dayValue) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(dayValue)
        ? prev.workingDays.filter((d) => d !== dayValue)
        : [...prev.workingDays, dayValue],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.termsAccepted)
      return setError("You must accept the Terms & Conditions");
    if (formData.workingDays.length === 0)
      return setError("Please select at least one working day");
    if (!formData.workingHours.from || !formData.workingHours.to)
      return setError("Please select working hours");
    if (!formData.registrationNumber)
      return setError("Registration number is required");

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Basic info
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("specialization", formData.specialization);
      formDataToSend.append("registrationNumber", formData.registrationNumber);
      formDataToSend.append("fee", formData.fee);
      formDataToSend.append("termsAccepted", formData.termsAccepted.toString());
      formDataToSend.append("role", "DOCTOR"); 

      // Working days & hours as JSON
      formDataToSend.append(
        "workingDays",
        JSON.stringify(formData.workingDays)
      );
      formDataToSend.append(
        "workingHours",
        JSON.stringify(formData.workingHours)
      );

      // Photo
      if (formData.photo) formDataToSend.append("photo", formData.photo);

      await api.post("/doctors/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Doctor registered successfully! Awaiting admin approval.");
      setFormData({
        name: "",
        email: "",
        password: "",
        specialization: "",
        registrationNumber: "",
        fee: "",
        workingDays: [],
        workingHours: { from: "", to: "" },
        photo: null,
        termsAccepted: false,
      });
      setPreview(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Doctor Registration
          </h1>
          <p className="text-gray-600">
            Join our network of healthcare professionals
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec._id} value={spec._id}>
                    {spec.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="registrationNumber"
                placeholder="Registration Number"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
              <input
                type="number"
                name="fee"
                placeholder="Consultation Fee (USD)"
                value={formData.fee}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              />
            </div>
          </div>

          {/* Working Schedule */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Working Schedule
            </h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Working Days *
              </label>
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((day) => (
                  <button
                    type="button"
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`py-3 rounded-lg border transition-all ${
                      formData.workingDays.includes(day.value)
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="text-sm font-medium">{day.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Working Hours *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    From
                  </label>
                  <input
                    type="time"
                    name="workingHours.from"
                    value={formData.workingHours.from}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">To</label>
                  <input
                    type="time"
                    name="workingHours.to"
                    value={formData.workingHours.to}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-green-200"
                />
              )}
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="space-y-6 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                    formData.termsAccepted
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                >
                  {formData.termsAccepted && (
                    <span className="text-white font-bold text-sm">✓</span>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                "Register as Doctor"
              )}
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>

        {/* Success/Error Messages */}
        <div className="mt-6">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
