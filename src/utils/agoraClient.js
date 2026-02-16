import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;


// 🔹 Factory function → creates a new client instance each time
export const createClient = () =>
  AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

// 🔹 Create microphone + camera tracks
export const createLocalTracks = async () => {
  const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
  return tracks;
};

// 🔹 Leave call and cleanup tracks
export const leaveCall = async (client, tracks = []) => {
  try {
    tracks.forEach((t) => t?.close());
    await client?.leave();
  } catch (err) {
    console.error("Agora leave error:", err);
  }
};

export { APP_ID };
