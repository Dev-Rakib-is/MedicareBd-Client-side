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

  // ----------------------------
  // CHECK AUTH
  // ----------------------------
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
        socket.emit("register-user", data.user._id);
        socketRegistered.current = true;
      }
    } catch (err) {
      console.log("Auth check failed:", err?.response?.data || err.message);

      // ❗ Token remove only if 401
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ----------------------------
  // SOCKET LISTENERS
  // ----------------------------
  useEffect(() => {
    socket.on("user-online", (data) => {
      console.log(`User ${data.userId} is online`);
    });

    socket.on("user-offline", (data) => {
      console.log(`User ${data.userId} is offline`);
    });

    return () => {
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, []);

  // LOGIN

  const login = async ({ email, password, role }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password, role });

      // Correct token saving
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      if (data.user?._id) {
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

  // REGISTER PATIENT

  const registerPatient = async (patientData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/patient", patientData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      if (data.user?._id) {
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

  // REGISTER DOCTOR

  const registerDoctor = async (doctorData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register/doctor", doctorData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      if (data.user?._id) {
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

  // LOGOUT

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    socketRegistered.current = false;
    socket.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
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
