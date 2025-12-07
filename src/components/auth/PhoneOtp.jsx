import { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebase";

const PhoneOtp = ({ onVerified }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
  };

  const sendOtp = async () => {
    setupRecaptcha();

    try {
      const response = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmObj(response);
      alert("OTP Sent Successfully");
    } catch (e) {
      console.error(e);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await confirmObj.confirm(otp);
      const user = result.user;
      const token = await user.getIdToken(); // Firebase JWT

      onVerified(token); // → send to backend
    } catch (e) {
      alert("Invalid OTP");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="+8801XXXXXXXXX"
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={sendOtp}>Send OTP</button>
      <div id="recaptcha-container"></div>

      <input type="text" placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
};

export default PhoneOtp;
