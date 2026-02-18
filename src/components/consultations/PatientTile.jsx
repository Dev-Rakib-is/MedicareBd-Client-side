import { Mic, MicOff, Video, VideoOff, X } from "lucide-react";
import Swal from "sweetalert2";

const PatientTile = ({ patient, toggleVideo, toggleMic, endCall }) => {
  const handleEndCall = async () => {
    const result = await Swal.fire({
      title: `End call with ${patient.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, End",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      endCall(patient.id);
    }
  };

  return (
    <div
      className={`relative border rounded-xl p-3 shadow-md bg-white transition-all duration-300 ${
        patient.videoJoined ? "col-span-3 h-96" : "h-48"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-gray-700">{patient.name}</h2>

        <div className="flex gap-3">
          {/* Mic */}
          <button
            onClick={() => toggleMic(patient.id)}
            className="hover:scale-110 transition"
          >
            {patient.micOn ? (
              <Mic color="green" size={20} />
            ) : (
              <MicOff color="red" size={20} />
            )}
          </button>

          {/* Video */}
          <button
            onClick={() => toggleVideo(patient.id)}
            className="hover:scale-110 transition"
          >
            {patient.videoOn ? (
              <Video color="green" size={20} />
            ) : (
              <VideoOff color="red" size={20} />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="hover:scale-110 transition"
          >
            <X color="red" size={20} />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="bg-gray-100 rounded-lg w-full h-[calc(100%-40px)] flex items-center justify-center relative overflow-hidden">
        {patient.videoJoined && patient.videoOn ? (
          <div className="text-gray-500 text-sm">Video Playing...</div>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
              {patient.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm mt-2">
              {patient.videoJoined ? "Camera Off" : "Video Preview"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTile;
