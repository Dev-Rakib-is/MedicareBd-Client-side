import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/api";
import socket from "../utils/socket.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const socketRegistered = useRef(false); 
  // Helper: get token from localStorage
  const getToken = () => localStorage.getItem("token");

  //  Check user auth from server
  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user && data.user._id && !socketRegistered.current) {
        socket.emit("register-user", data.user._id);
        socketRegistered.current = true;
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      socketRegistered.current = false; 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {

    socket.on("user-online", (data) => {

      console.log(`User ${data.userId} is online`);
    });

    socket.on("user-offline", (data) => {
      console.log(`User ${data.userId} is offline`);
    });

    return () => {
      // Cleanup listeners
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, []);

  // Login
  const login = async ({ email, password, role }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password, role });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token); 
      if (data.user && data.user._id) {
        socket.emit("register-user", data.user._id);
        socketRegistered.current = true;
      }
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  // Register Patient
  const registerPatient = async (patientData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/patient", patientData);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      if (data.user && data.user._id) {
        socket.emit("register-user", data.user._id);
        socketRegistered.current = true;
      }
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  // Register Doctor
  const registerDoctor = async (doctorData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/doctor", doctorData);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      if (data.user && data.user._id) {
        socket.emit("register-user", data.user._id);
        socketRegistered.current = true;
      }
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    socketRegistered.current = false; 
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, registerPatient, registerDoctor, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);