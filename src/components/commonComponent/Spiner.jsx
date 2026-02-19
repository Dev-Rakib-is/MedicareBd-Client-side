import { Circles } from "react-loading-icons";

const Spiner = ({ perusal }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Circles className={"text-blue-600 text-5xl"} />
      {perusal && (
        <p className="mt-6 text-xl font-semibold text-gray-700">{perusal}</p>
      )}
    </div>
  );
};

export default Spiner;
