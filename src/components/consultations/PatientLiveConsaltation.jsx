import { useState, useRef, useEffect } from "react";

const PatientLiveConsaltation = ({ onEndCall }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);

  // Media setup
  useEffect(() => {
    async function initMedia() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (localVideoRef.current) localVideoRef.current.srcObject = s;
      } catch (err) {
        console.warn("Camera or microphone not found.:", err);
      }
    }
    initMedia();
  }, []);

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !micOn));
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !camOn));
      setCamOn(!camOn);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() === "" && !file) return;
    const newMsg = { text: messageInput, file };
    setMessages(prev => [...prev, newMsg]);
    setMessageInput("");
    setFile(null);
    // TODO: socket.io emit here
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 z-40">
      {/* Video area */}
      <div className="flex flex-1 relative bg-black mt-16">
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
        <video
          ref={localVideoRef}
          className="w-32 h-32 absolute bottom-4 right-4 border-2 border-white rounded-md object-cover"
          autoPlay
          muted
          playsInline
        />
        {/* Control buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button
            onClick={toggleMic}
            className={`px-4 py-2 rounded-full ${micOn ? "bg-green-500" : "bg-red-500"} text-white`}
          >
            {micOn ? "Mic On" : "Mic Off"}
          </button>
          <button
            onClick={toggleCam}
            className={`px-4 py-2 rounded-full ${camOn ? "bg-green-500" : "bg-red-500"} text-white`}
          >
            {camOn ? "Cam On" : "Cam Off"}
          </button>
          <button
            onClick={onEndCall}
            className="px-4 py-2 rounded-full bg-red-700 text-white"
          >
            End Call
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="h-3 border-t border-gray-300 flex flex-col p-2 max-w-md w-full mx-auto">
        <div className="flex-1 overflow-y-auto mb-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-1">
              {msg.text && <p>{msg.text}</p>}
              {msg.file && <p className="text-blue-500">{msg.file.name}</p>}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded px-2 py-1"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientLiveConsaltation;
