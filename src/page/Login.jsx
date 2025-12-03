import { useState } from "react";
import { useAuth } from "../contex/AuthContex";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [error, setError] = useState("");
  const [loading, setLocalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLocalLoading(true);
      await login({ email, password, role });
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login Failed";
      setError(errorMsg);
      setTimeout(() => setError(""), 3000);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 transition-all"
      >
        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Login
        </h3>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-box dark:placeholder-white/70"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box dark:placeholder-white/70"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 -translate-y-1/2 right-3 dark:text-white"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input-box dark:placeholder-white/70"
        >
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          type="submit"
          className={`w-full py-3 rounded-xl text-white border font-semibold text-lg shadow-md${
            loading
              ? " bg-purple-300 cursor-not-allowed opacity-70"
              : " bg-purple-500 cursor-pointer"
          }`}
        >
          {loading ? "Logging..." : "Login"}
        </motion.button>

        {error && <p className="text-center text-red-600">{error}</p>}

        <p className="text-center text-gray-600 dark:text-gray-300">
          Don't have an account?
          <Link
            to="/registration"
            className="text-violet-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
