// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://medicarebd-server-side-1.onrender.com/api/v1",
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
