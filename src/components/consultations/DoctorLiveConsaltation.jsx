
import  { useState } from "react";
import PatientTile from "./PatientTile";
import { MessageSquare } from "lucide-react";

const DoctorConsultation = () => {
  const [patients, setPatients] = useState([
    { id: 1, name: "Patient 1", videoJoined: false, micOn: true, videoOn: true },
    { id: 2, name: "Patient 2", videoJoined: false, micOn: true, videoOn: true },
  ]);

  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const toggleVideo = (id) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, videoOn: !p.videoOn, videoJoined: !p.videoJoined } : p
      )
    );
  };

  const toggleMic = (id) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, micOn: !p.micOn } : p))
    );
  };

  const endCall = (id) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, videoJoined: false, videoOn: false } : p))
    );
  };

  const sendMessage = () => {
    if (chatInput.trim() === "") return;
    setChatMessages((prev) => [...prev, { sender: "Doctor", text: chatInput }]);
    setChatInput("");
  };

  return (
    <div className="p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">Doctor Consultation</h1>

      {/* Video Tiles */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {patients.map((patient) => (
          <PatientTile
            key={patient.id}
            patient={patient}
            toggleVideo={toggleVideo}
            toggleMic={toggleMic}
            endCall={endCall}
          />
        ))}
      </div>

      {/* Chat Section Toggle */}
      <div className="flex items-center mb-2">
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setChatVisible(!chatVisible)}
        >
          <MessageSquare size={20} /> Chat
        </button>
      </div>

      {/* Chat Box */}
      {chatVisible && (
        <div className="border rounded p-2 w-full max-w-md">
          <div className="h-40 overflow-y-auto mb-2 bg-gray-100 p-2 rounded">
            {chatMessages.length === 0 ? (
              <p className="text-gray-400 text-sm">No messages yet...</p>
            ) : (
              chatMessages.map((msg, idx) => (
                <p key={idx} className="mb-1">
                  <strong>{msg.sender}: </strong>
                  {msg.text}
                </p>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded px-2 py-1"
            />
            <button
              className="bg-green-500 text-white px-4 py-1 rounded"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorConsultation;
