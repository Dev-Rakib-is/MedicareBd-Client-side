
import { Mic, Video, X } from "lucide-react";

const PatientTile = ({ patient, toggleVideo, toggleMic, endCall }) => {
  return (
    <div
      className={`border rounded p-2 transition-all duration-300 ${
        patient.videoJoined ? "col-span-3 h-96" : "h-40"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{patient.name}</h2>
        <div className="flex gap-2">
          <button onClick={() => toggleMic(patient.id)}>
            <Mic color={patient.micOn ? "green" : "red"} size={20} />
          </button>
          <button onClick={() => toggleVideo(patient.id)}>
            <Video color={patient.videoOn ? "green" : "red"} size={20} />
          </button>
          <button onClick={() => endCall(patient.id)}>
            <X color="red" size={20} />
          </button>
        </div>
      </div>
      <div className="bg-gray-200 w-full h-full flex items-center justify-center">
        {patient.videoJoined ? "Video Playing..." : "Video Preview"}
      </div>
    </div>
  );
};

export default PatientTile;
