import { useEffect, useState } from "react";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setShow(true); // Show modal only if consent not set
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-40 left-0 right-0 flex justify-center z-50">
      <div className="bg-white rounded-lg max-w-xl w-full mx-4 flex flex-col md:flex-row items-center justify-between p-8 border border-cyan-600 shadow-2xl">
        <p className="text-gray-700 mb-2 md:mb-0">
          We use cookies to improve your experience. By clicking “Accept”, you agree to our use of cookies.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
