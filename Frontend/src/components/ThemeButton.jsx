import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const ThemeButton = () => {
  const darkMode = useSelector((state) => state.theme.darkMode); 
  const dispatch = useDispatch();



  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => dispatch(toggleTheme())}
      className={`relative p-3 rounded-full transition-all shadow-lg 
        ${darkMode ? "bg-gray-800 shadow-gray-800 hover:shadow-gray-700/50" 
                   : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:shadow-blue-500/50"}`}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {darkMode ? (
          <Sun size={24} className="text-yellow-300 drop-shadow-lg" />
        ) : (
          <Moon size={24} className="text-gray-800 dark:text-gray-200 drop-shadow-lg" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeButton;
