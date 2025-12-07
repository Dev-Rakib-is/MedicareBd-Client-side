import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/api";

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
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token); // save JWT token
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
