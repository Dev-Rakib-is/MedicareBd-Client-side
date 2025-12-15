import { useState } from "react";
import DoctorRegistrationForm 
from "../components/registrationHelper/DocrotRegistrationForm";
import PatientRegistrationForm from "../components/registrationHelper/PatientRegistartionForm";


const Registration = () => {
  const [isDoctorForm, setIsDoctorForm] = useState(false);

  return (
    <div className=" bg-gray-50 mt-18">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join thousands of users on MediCareBD
          </p>
        </div>

        {/* Role Selector */}
        <div className="bg-white rounded-xl shadow-md p-4 ">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Select Your Role
            </h2>
            
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setIsDoctorForm(false)}
                className={` items-center p-2 rounded-lg border-2 transition-all ${
                  !isDoctorForm
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>Patient
              </button>
              
              <button
                onClick={() => setIsDoctorForm(true)}
                className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                  isDoctorForm
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  Doctor
              </button>
            </div>
          </div>

          {/* Form */}
          <div>
            {!isDoctorForm ? <PatientRegistrationForm /> : <DoctorRegistrationForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;