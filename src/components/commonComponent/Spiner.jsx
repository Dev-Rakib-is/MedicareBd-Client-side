import { Circles } from "react-loading-icons";

const Spiner = ({ perusal }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Circles fill="#3b82f6" stroke="#60a5fa" height="80" width="80" />
      {perusal && (
        <p className="mt-6 text-xl font-semibold text-gray-700">{perusal}</p>
      )}
    </div>
  );
};

export default Spiner;
