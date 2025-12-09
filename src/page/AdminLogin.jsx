import { useState } from "react";
import { useAuth } from "../contex/AuthContex";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      // Role fixed as ADMIN
      await login({ email, password, role: "ADMIN" });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Admin Login
        </h3>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-box dark:placeholder-white/70"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-box dark:placeholder-white/70"
          required
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          type="submit"
          className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-md ${
            loading ? " bg-gray-300 cursor-not-allowed" : " bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Processing..." : "Login"}
        </motion.button>

        {error && <p className="text-center text-red-600">{error}</p>}
      </form>
    </section>
  );
};

export default AdminLogin;
