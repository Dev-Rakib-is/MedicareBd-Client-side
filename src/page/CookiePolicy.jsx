import { useNavigate } from "react-router";

const CookiePolicy = () => {
  const Navigate = useNavigate();
  return (
    <div className="bg-gray-900 text-gray-300 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Cookie Policy</h1>

        <p className="mb-4">
          This Cookie Policy explains how our healthcare platform uses cookies
          and similar technologies to enhance your experience.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          What are Cookies?
        </h2>
        <p className="mb-4">
          Cookies are small text files stored on your device when you visit a
          website. They help us remember your preferences, login information,
          and improve overall user experience.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          How We Use Cookies
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Remember your login and session information</li>
          <li>Improve website performance and user experience</li>
          <li>Analyze website traffic using tools like Google Analytics</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          Managing Cookies
        </h2>
        <p className="mb-4">
          You can choose to disable cookies in your browser settings, but some
          features of the platform may not function properly.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          Contact Us
        </h2>
        <p>
          For any questions regarding this Cookie Policy, please contact us at{" "}
          <a
            href="mailto:ri3390990@gmail.com"
            className="text-blue-400 hover:underline"
          >
            ri3390990@gmail.com
          </a>
          .
        </p>
        <button
          className="hover:underline underline-offset-4 font-bold mt-6 cursor-pointer"
          onClick={() => Navigate("/")}
        >
          Back Home
        </button>
      </div>
    </div>
  );
};

export default CookiePolicy;
