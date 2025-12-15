import { Link } from "react-router";

export default function TermsPage() {
  return (
    <div className="mt-16 bg-gray-50 flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">
          Welcome to our platform. By accessing or using our services, you agree to comply with and be bound by the following terms and conditions:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>You must provide accurate and complete information during registration.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must not use our platform for any illegal or unauthorized purposes.</li>
          <li>All consultations and data shared on this platform are confidential.</li>
          <li>We reserve the right to modify these terms at any time without prior notice.</li>
          <li>Admin reserves the right to block or delete any account at any time without prior notice, in accordance with platform policies.</li>
        </ul>
        <p className="text-gray-700 mb-6">
          By creating an account, you acknowledge that you have read, understood, and agreed to these terms and conditions.
        </p>
        <div className="flex justify-center">
          <Link
            to="/registration"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
          >
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
