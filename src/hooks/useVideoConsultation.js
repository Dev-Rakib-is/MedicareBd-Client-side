import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { useAuth } from "../contex/AuthContex";
import { useNavigate } from "react-router";

export function useVideoConsultation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State to store active appointment/room
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Connect socket if not already connected
    if (!socket.connected) socket.connect();

    // Register user on server
    socket.emit("register-user", {
      userId: user._id,
      role: user.role,
    });

    // Listen for appointment start
    const handleAppointmentStart = ({ roomId }) => {
      setRoomId(roomId);
      setActiveAppointment({ roomId });
      navigate(`/video/${roomId}`);
    };

    socket.on("appointment-start", handleAppointmentStart);

    // Cleanup on unmount
    return () => {
      socket.off("appointment-start", handleAppointmentStart);
    };
  }, [user, navigate]);

  // Return state so components can use it safely
  return { activeAppointment, roomId };
}
