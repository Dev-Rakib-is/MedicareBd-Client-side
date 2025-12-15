import { useState } from "react";
import { Link } from "react-router-dom";
import api from './../../api/api';

export default function PatientRegistrationForm() {
  // Form Data 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    photo: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form data update
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Age validation
  const handleAgeChange = (e) => {
    const value = e.target.value;
    const numberValue = Number(value);
    
    if (value === "" || (numberValue >= 0 && numberValue <= 120)) {
      setFormData({
        ...formData,
        age: value
      });
    }
  };

  // Photo
  const handlePhotoChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0]
    });
  };

  //  Form Submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    //  Age validation 
    if (formData.age && (Number(formData.age) < 0 || Number(formData.age) > 120)) {
      setMessage(" Age must be between 0 and 120 years.");
      setLoading(false);
      return;
    }

    try {
      //  FormData 
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("gender", formData.gender);
      
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      //  API call
      const response = await api.post("/auth/register/patient", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setMessage(" Registration successful! Redirecting to login...");

        // Form 
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          photo: null
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(` ${error.response?.data?.message || "Registration failed. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl mb-10">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Patient Registration</h2>
      </div>

      {/* Login Link */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800">
            Login here
          </Link>
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          <div className="flex items-center">
            
            <span className="ml-2">{message}</span>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0"
            required
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0"
            required
            placeholder="name@gmail.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-0"
            required
            placeholder="Create a strong password"
            minLength="6"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleAgeChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-0"
              placeholder="25"
              min="0"
              max="120"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-0"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Profile Photo (Optional) */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Profile Photo (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-3 border border-gray-300 rounded-lg outline-0"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-colors ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Creating Account...
            </div>
          ) : "Create Account"}
        </button>
      </form>
    </div>
  );
}