import axios from "axios";

//  Create Axios instance
const api = axios.create({
  baseURL: "https://medicarebd-server-side-1.onrender.com/api/v1",
  withCredentials: true, // cookies support
});

//  Request interceptor to dynamically set Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//  Response interceptor to handle 401 (token expired)
api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const res = await api.post("/auth/refresh-token");

        // Save new token in localStorage
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
        }

        // Retry the original request
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
