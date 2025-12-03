/* eslint-disable no-unused-vars */
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex justify-center items-center flex-col gap-4">
      <p className="text-red-600 text-xl font-semibold">
        You can not Access This page :
      </p>

      <motion.button
        onClick={() => navigate("/")}
        whileTap={{ scale: 0.95 }}
        className="text-green-600 cursor-pointer border px-4 py-2 rounded"
      >
        Go Home
      </motion.button>
    </div>
  );
};

export default Unauthorized;
