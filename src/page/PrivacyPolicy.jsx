import { useNavigate } from "react-router";

const PrivacyPolicy = () => {

    const navigate = useNavigate()
  return (
    <div className=" bg-gray-900 text-gray-300 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Privacy Policy
        </h1>

        <p className="mb-4">
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you use our healthcare platform.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          Information We Collect
        </h2>
        <p className="mb-4">
          We may collect personal information such as your name, phone number,
          email address, and basic health-related information required to
          provide medical services.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          How We Use Your Information
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>To provide healthcare and consultation services</li>
          <li>To manage appointments and medical records</li>
          <li>To improve our platform and user experience</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          Data Protection
        </h2>
        <p className="mb-4">
          We take appropriate security measures to protect your personal data
          from unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          Data Sharing
        </h2>
        <p className="mb-4">
          We do not sell or share your personal information with third parties
          except when required by law or necessary to provide our services.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          Your Consent
        </h2>
        <p className="mb-4">
          By using this platform, you consent to the collection and use of your
          information in accordance with this Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us at <a href="mailto:ri3390990@gmail.com" className="text-blue-400 hover:underline underline-offset-4 cursor-pointer"> ri3390990@gmail.com </a>.
        </p>
        <button className="mt-10 font-bold cursor-pointer hover:underline underline-offset-4" onClick={()=>navigate("/")}>Back Home</button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
