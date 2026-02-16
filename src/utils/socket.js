import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER;

if (!SOCKET_URL) {
  console.error("❌ VITE_SOCKET_SERVER missing in .env file");
}

const socket = io(SOCKET_URL, {
  withCredentials: true,

  // IMPORTANT SETTINGS
  autoConnect: false, 
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// ===== Optional Debug Logs =====
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;
