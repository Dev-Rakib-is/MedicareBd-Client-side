import { Link } from "react-router-dom";

const PatientTerms = () => {
  return (
    <div className="mt-16 bg-gray-50 flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Patient Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">
          By using our platform as a patient, you agree to comply with the following terms:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>Provide accurate and complete personal and medical information.</li>
          <li>Respect the privacy and confidentiality of all healthcare information shared.</li>
          <li>Use the platform only for lawful medical consultations.</li>
          <li>Follow instructions and guidance provided by licensed doctors.</li>
          <li>We reserve the right to suspend or terminate your account for misuse.</li>
        </ul>
        <p className="text-gray-700 mb-6">
          By registering, you acknowledge that you have read, understood, and agreed to these patient terms.
        </p>
        <div className="flex justify-center gap-2">
          <Link
            to="/registration"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
          >
            Back to Registration
          </Link>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PatientTerms;
