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

  const [status, setStatus] = useState("idle");
  // idle | connecting | waiting | connected | error

  const channelName = appointmentId ? `consult_${appointmentId}` : null;

  useEffect(() => {
    if (!channelName) return;

    let timeoutId;

    const startCall = async () => {
      try {
        setStatus("connecting");

        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        await api.post("/consultations/start", { appointmentId });

        const client = createClient();
        clientRef.current = client;

        const uid = Math.floor(Math.random() * 100000);

        const { data } = await api.post("/agora/token", {
          channelName,
          uid,
        });

        await client.join(APP_ID, channelName, data.token, uid);

        const tracks = await createLocalTracks();
        tracksRef.current = tracks;

        tracks[1].play(localVideoRef.current);
        await client.publish(tracks);

        setStatus("waiting");

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);

          if (mediaType === "video") {
            user.videoTrack.play(remoteVideoRef.current);
            setStatus("connected");
            clearTimeout(timeoutId);
          }

          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });

        // Connection timeout UX
        timeoutId = setTimeout(() => {
          if (status !== "connected") {
            Swal.fire({
              icon: "info",
              title: "Waiting for doctor",
              text: "Doctor has not joined yet.",
            });
          }
        }, 30000);
      } catch (err) {
        console.error(err);
        setStatus("error");

        Swal.fire({
          icon: "error",
          title: "Connection Failed",
          text: "Please check camera/microphone permission",
        });
      }
    };

    startCall();

    return () => {
      clearTimeout(timeoutId);
      leaveCall(clientRef.current, tracksRef.current);
    };
  }, [channelName, appointmentId]);

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
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, End",
    });

    if (!result.isConfirmed) return;

    await leaveCall(clientRef.current, tracksRef.current);
    await api.post("/consultations/end", { appointmentId });

    Swal.fire({
      icon: "success",
      title: "Consultation Ended",
      timer: 1500,
      showConfirmButton: false,
    });

    onEndCall?.();
  };

  /* ================= UI STATES ================= */

  if (!appointmentId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Invalid Appointment
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        Connection Error. Try again later.
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-900 text-white flex flex-col mt-16">
      <div className="p-4 text-center bg-gray-800 font-semibold shadow">
        Live Consultation with {doctorName}
      </div>

      <div className="flex-1 relative bg-black">
        <div ref={remoteVideoRef} className="w-full h-full" />

        {status === "waiting" && (
          <div className="absolute inset-0 flex items-center justify-center text-lg">
            Waiting for doctor to join...
          </div>
        )}

        <div className="absolute bottom-6 right-6 w-40 h-32 rounded-xl overflow-hidden border border-white/30 bg-black">
          <div ref={localVideoRef} className="w-full h-full" />

          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm">
              Camera Off
            </div>
          )}
        </div>
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
