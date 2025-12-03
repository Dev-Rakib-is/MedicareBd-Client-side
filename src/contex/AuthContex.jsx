import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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

  //  Check user auth from server
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/me", { withCredentials: true });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //  Login
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  //  Register Patient
  const registerPatient = async (patientData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/patient", patientData, {
        withCredentials: true,
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
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
      const { data } = await api.post("/auth/register/doctor", doctorData, {
        withCredentials: true,
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
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
