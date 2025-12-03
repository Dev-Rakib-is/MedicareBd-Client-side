import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contex/ThemeContex";
import { motion } from "motion/react";

const Darkmode = () => {
  const { dark, setDark } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setDark(!dark)}
      className="dark:text-white cursor-pointer outline-0"
    >
      {dark ? (
        <Sun className="w-8 h-8 border bg-gray-600 dark:bg-white dark:text-black p-1 rounded-full" />
      ) : (
        <Moon className="w-8 h-8 border  border-black/40 p-1 rounded-full" />
      )}
    </motion.button>
  );
};

export default Darkmode;
