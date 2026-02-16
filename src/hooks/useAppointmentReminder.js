
import { useEffect } from "react";
import socket from '../utils/socket';

export const useAppointmentReminder = (user, onReminder) => {
  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("register-user", { userId: user._id, role: user.role });

    socket.on("appointment-reminder", (data) => {
      if (onReminder) onReminder(data);
    });

    return () => {
      socket.off("appointment-reminder");
      socket.disconnect();
    };
  }, [user]);
};
