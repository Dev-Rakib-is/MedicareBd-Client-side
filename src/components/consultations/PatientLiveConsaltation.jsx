import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import api from "../../api/api";

const APP_ID = "bfad43ab7d974c609de7a8b03feffe7f";
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const PatientLiveConsultation = ({ appointmentId, onEndCall }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [localTracks, setLocalTracks] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const channelName = appointmentId ? `consult_${appointmentId}` : null;

  // =============================
  // JOIN + PUBLISH
  // =============================
  useEffect(() => {
    if (!channelName) return; // prevent undefined channelName

    let tracks = [];

    const startCall = async () => {
      try {
        const uid = Math.floor(Math.random() * 100000);

        // get token from backend
        const { data } = await api.post("/agora/token", { channelName, uid });
        const token = data.token;

        await client.join(APP_ID, channelName, token, uid);

        // create mic + cam tracks
        tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks(tracks);

        // show local video
        tracks[1].play(localVideoRef.current);

        // publish local tracks
        await client.publish(tracks);

        // handle remote users
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);

          if (mediaType === "video") {
            user.videoTrack.play(remoteVideoRef.current);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });
      } catch (err) {
        console.error("Agora error:", err);
      }
    };

    startCall();

    return () => {
      tracks.forEach((t) => t?.close());
      client.leave();
    };
  }, [channelName]);

  // =============================
  // MIC & CAM TOGGLE
  // =============================
  const toggleMic = async () => {
    if (!localTracks[0]) return;
    await localTracks[0].setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const toggleCam = async () => {
    if (!localTracks[1]) return;
    await localTracks[1].setEnabled(!camOn);
    setCamOn(!camOn);
  };

  // =============================
  // END CALL
  // =============================
  const handleEndCall = async () => {
    localTracks.forEach((t) => t?.close());
    await client.leave();
    onEndCall?.();
  };

  if (!appointmentId) return <div>Loading consultation...</div>;

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Remote video */}
      <div ref={remoteVideoRef} className="flex-1" />

      {/* Local video */}
      <div
        ref={localVideoRef}
        className="w-40 h-40 absolute bottom-4 right-4 rounded-xl overflow-hidden border"
      />

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded ${micOn ? "bg-green-600" : "bg-red-600"} text-white`}
        >
          Mic
        </button>

        <button
          onClick={toggleCam}
          className={`px-4 py-2 rounded ${camOn ? "bg-green-600" : "bg-red-600"} text-white`}
        >
          Cam
        </button>

        <button
          onClick={handleEndCall}
          className="px-4 py-2 rounded bg-red-800 text-white"
        >
          End
        </button>
      </div>
    </div>
  );
};

export default PatientLiveConsultation;
