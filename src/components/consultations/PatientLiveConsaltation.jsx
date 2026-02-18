import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import api from "../../api/api";
import {
  createClient,
  createLocalTracks,
  leaveCall,
  APP_ID,
} from "../../utils/agoraClient";

const PatientLiveConsultation = ({
  appointmentId,
  doctorName = "Doctor",
  onEndCall,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const clientRef = useRef(null);
  const tracksRef = useRef([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [status, setStatus] = useState("waiting"); // waiting | connecting | connected

  const channelName = appointmentId ? `consult_${appointmentId}` : null;

  useEffect(() => {
    if (!channelName) return;

    const startCall = async () => {
      try {
        // 1️⃣ Permission check
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        await api.post("/consultations/start", { appointmentId });

        setStatus("connecting");

        const client = createClient();
        clientRef.current = client;

        const uid = Math.floor(Math.random() * 100000);
        const { data } = await api.post("/agora/token", { channelName, uid });

        await client.join(APP_ID, channelName, data.token, uid);

        const tracks = await createLocalTracks();
        tracksRef.current = tracks;

        tracks[1].play(localVideoRef.current);
        await client.publish(tracks);

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video")
            user.videoTrack.play(remoteVideoRef.current);
          if (mediaType === "audio") user.audioTrack.play();
        });

        setStatus("connected");
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Permission Denied",
          text: "Microphone or Camera access denied. Please allow permissions.",
        });
        setStatus("waiting");
      }
    };

    startCall();

    return () => leaveCall(clientRef.current, tracksRef.current);
  }, [channelName]);

  const toggleMic = async () => {
    const mic = tracksRef.current[0];
    if (!mic) return;
    await mic.setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const toggleCam = async () => {
    const cam = tracksRef.current[1];
    if (!cam) return;
    await cam.setEnabled(!camOn);
    setCamOn(!camOn);
  };

  const handleEndCall = async () => {
    const result = await Swal.fire({
      title: "End Consultation?",
      text: "Are you sure you want to end this consultation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, End",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await leaveCall(clientRef.current, tracksRef.current);
      await api.post("/consultations/end", { appointmentId });
      Swal.fire({
        icon: "success",
        title: "Consultation Ended",
        timer: 1500,
        showConfirmButton: false,
      });
      onEndCall?.();
    }
  };

  return (
    <div className="relative h-screen bg-gray-900 text-white flex flex-col mt-16">
      <div className="p-4 text-center bg-gray-800 font-semibold shadow">
        Live Consultation with {doctorName}
      </div>

      <div className="flex-1 relative">
        <div ref={remoteVideoRef} className="w-full h-full bg-black" />

        <div className="absolute bottom-6 right-6 w-40 h-32 rounded-xl overflow-hidden border-2 border-white/30 bg-black">
          <div ref={localVideoRef} className="w-full h-full" />
          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm">
              Camera Off
            </div>
          )}
        </div>

        {status === "waiting" && (
          <div className="absolute inset-0 flex items-center justify-center text-lg">
            Waiting for doctor...
          </div>
        )}
        {status === "connecting" && (
          <div className="absolute inset-0 flex items-center justify-center text-lg">
            Connecting...
          </div>
        )}
      </div>

      <div className="p-4 flex justify-center gap-4 bg-gray-800">
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded ${
            micOn ? "bg-green-600" : "bg-red-600"
          }`}
        >
          Mic
        </button>
        <button
          onClick={toggleCam}
          className={`px-4 py-2 rounded ${
            camOn ? "bg-green-600" : "bg-red-600"
          }`}
        >
          Cam
        </button>
        <button
          onClick={handleEndCall}
          className="px-4 py-2 rounded bg-red-700"
        >
          End
        </button>
      </div>
    </div>
  );
};

export default PatientLiveConsultation;
