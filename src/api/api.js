import axios from "axios";

const api = axios.create({
  baseURL: "https://medicarebd-server-side-1.onrender.com/api/v1",
  withCredentials: true,
});

export default api;
 