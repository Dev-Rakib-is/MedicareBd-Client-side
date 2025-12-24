import { Link } from "react-router";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-10 px-4 mt-16">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Terms & Conditions</h1>
        
        {/* Doctor Terms Section */}
        <div className="mb-12 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">For Doctors</h2>
          <p className="text-gray-700 mb-4">
            By using our platform as a doctor, you agree to comply with the following terms:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li className="pl-2">Provide accurate professional credentials and maintain license validity.</li>
            <li className="pl-2">Maintain patient confidentiality at all times.</li>
            <li className="pl-2">Ensure all consultations comply with medical laws and telemedicine guidelines.</li>
            <li className="pl-2">Be responsible for your medical advice and prescriptions.</li>
            <li className="pl-2">The platform may suspend or remove accounts for violations of policies.</li>
          </ul>
          <p className="text-gray-700">
            By registering, you acknowledge that you have read, understood, and agreed to these doctor terms.
          </p>
        </div>

        {/* Patient Terms Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-4">For Patients</h2>
          <p className="text-gray-700 mb-4">
            By using our platform as a patient, you agree to comply with the following terms:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li className="pl-2">Provide accurate and complete personal and medical information.</li>
            <li className="pl-2">Respect the privacy and confidentiality of all healthcare information shared.</li>
            <li className="pl-2">Use the platform only for lawful medical consultations.</li>
            <li className="pl-2">Follow instructions and guidance provided by licensed doctors.</li>
            <li className="pl-2">We reserve the right to suspend or terminate your account for misuse.</li>
          </ul>
          <p className="text-gray-700">
            By registering, you acknowledge that you have read, understood, and agreed to these patient terms.
          </p>
        </div>
        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            to="/registration"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
          >
            Back to Registration
          </Link>
          <Link 
            to="/" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;