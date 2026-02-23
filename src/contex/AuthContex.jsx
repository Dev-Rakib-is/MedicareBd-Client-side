import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import api from "../api/api";
import socket from "../utils/socket.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const socketRegistered = useRef(false);

  const getToken = () => localStorage.getItem("token");

  // ===============================
  // CHECK AUTH
  // ===============================
  const checkAuth = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?._id && !socketRegistered.current) {
        socket.connect();
        socket.emit("register-user", {
          userId: data.user._id,
          role: data.user.role,
        });

        socketRegistered.current = true;
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ===============================
  // SOCKET LISTENERS
  // ===============================
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  // ===============================
  // LOGIN (Password)
  // ===============================
  const login = async ({ email, password, role }) => {
    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email,
        password,
        role,
      });

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      if (data.user?._id) {
        socket.connect();
        socket.emit("register-user", {
          userId: data.user._id,
          role: data.user.role,
        });

        socketRegistered.current = true;
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // OTP LOGIN
  // ===============================

  const sendOtp = async ({ phone, role }) => {
    try {
      setLoading(true);

      const { data } = await api.post("/auth/send-otp", {
        phone,
        role,
      });

      return data;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async ({ phone, otp, role }) => {
    try {
      setLoading(true);

      const { data } = await api.post("/auth/verify-otp", {
        phone,
        otp,
        role,
      });

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      if (data.user?._id) {
        socket.connect();
        socket.emit("register-user", {
          userId: data.user._id,
          role: data.user.role,
        });

        socketRegistered.current = true;
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // REGISTER PATIENT
  // ===============================
  const registerPatient = async (patientData) => {
    try {
      setLoading(true);

      const { data } = await api.post("/auth/register/patient", patientData);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // REGISTER DOCTOR
  // ===============================
  const registerDoctor = async (doctorData) => {
    try {
      setLoading(true);

      const { data } = await api.post("/auth/register/doctor", doctorData);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      return data;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = () => {
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    socketRegistered.current = false;
    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        sendOtp,
        verifyOtp,
        registerPatient,
        registerDoctor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
