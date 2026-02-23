import { useState } from "react";
import { useAuth } from "../contex/AuthContex";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import socket from "../utils/socket";

const Login = () => {
  const { login, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // ================= EMAIL LOGIN =================
  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = await login({
        email: email.trim(),
        password,
        role,
      });

      if (!socket.connected) socket.connect();

      socket.emit("register-user", {
        userId: data.user._id,
        role: data.user.role,
      });

      if (data.user.role === "ADMIN") navigate("/dashboard");
      else if (data.user.role === "DOCTOR") navigate("/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    setError("");

    if (!phone) {
      setError("Phone number required");
      return;
    }

    if (!phone.startsWith("+")) {
      setError("Use country code. Example: +8801XXXXXXXXX");
      return;
    }

    try {
      setLoading(true);

      await sendOtp({ phone, role, purpose: "LOGIN" });

      setOtpSent(true);
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  // ================= VERIFY OTP =================
const handleVerifyOtp = async () => {
  setError("");

  if (!/^\d{6}$/.test(otp)) {
    setError("OTP must be 6 digits");
    return;
  }

  try {
    setLoading(true);

    const data = await verifyOtp({ phone, otp, role, purpose: "LOGIN" });

    if (!socket.connected) socket.connect();

    socket.emit("register-user", {
      userId: data.user._id,
      role: data.user.role,
    });

    if (data.user.role === "ADMIN") navigate("/dashboard");
    else if (data.user.role === "DOCTOR") navigate("/dashboard");
    else navigate("/");
  } catch (err) {
    setError(err?.message || "OTP verification failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={!isOtpLogin ? handleLogin : (e) => e.preventDefault()}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h3 className="text-2xl font-bold text-center">
          {isOtpLogin ? "OTP Login" : "Login"}
        </h3>

        <p
          className="text-sm text-center text-violet-600 cursor-pointer hover:underline"
          onClick={() => {
            setIsOtpLogin(!isOtpLogin);
            setOtpSent(false);
            setError("");
          }}
        >
          {isOtpLogin ? "Use Email & Password" : "Login via OTP"}
        </p>

        {/* ========== PASSWORD LOGIN ========== */}
        {!isOtpLogin && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <select
              className="input-box"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </>
        )}

        {/* ========== OTP LOGIN ========== */}
        {isOtpLogin && (
          <>
            <input
              type="tel"
              placeholder="Phone Number +8801XXXXXXXXX"
              className="input-box"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                className="input-box"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}

            <select
              className="input-box"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </>
        )}

        {/* ========== BUTTON ========== */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          disabled={loading}
          onClick={
            isOtpLogin
              ? otpSent
                ? handleVerifyOtp
                : handleSendOtp
              : handleLogin
          }
          className="w-full py-3 rounded-xl text-white bg-blue-500 font-semibold"
        >
          {loading
            ? "Processing..."
            : isOtpLogin
              ? otpSent
                ? "Verify OTP"
                : "Send OTP"
              : "Login"}
        </motion.button>

        {error && <p className="text-center text-red-600">{error}</p>}

        {!isOtpLogin && (
          <p className="text-center">
            Don't have account?{" "}
            <Link to="/registration" className="text-violet-600">
              Register
            </Link>
          </p>
        )}
      </form>
    </section>
  );
};

export default Login;
