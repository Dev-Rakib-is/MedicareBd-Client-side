import { useNavigate } from "react-router";

const Disclaimer = () => {
  const Navigate = useNavigate();
  return (
    <div className=" bg-gray-900 text-gray-300 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Disclaimer</h1>

        <p className="mb-4">
          The information provided on this healthcare platform is for general
          informational purposes only. It is not intended as a substitute for
          professional medical advice, diagnosis, or treatment.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          No Medical Advice
        </h2>
        <p className="mb-4">
          Always seek the advice of a qualified healthcare provider with any
          questions you may have regarding a medical condition. Never disregard
          professional medical advice or delay seeking it because of something
          you have read on this platform.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          Limitation of Liability
        </h2>
        <p className="mb-4">
          We are not responsible for any actions taken by users based on the
          information provided on this platform. Use the platform at your own
          risk.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          External Links
        </h2>
        <p className="mb-4">
          This platform may contain links to external websites. We do not
          control and are not responsible for the content of those websites.
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-2">
          User Responsibility
        </h2>
        <p>
          Users are responsible for consulting qualified healthcare
          professionals before making any medical decisions based on information
          from this platform.
        </p>
        <button className="font-bold cursor-pointer hover:underline underline-offset-4 mt-6" onClick={()=>Navigate("/")}>Back Home</button>
      </div>
    </div>
  );
};

export default Disclaimer;
