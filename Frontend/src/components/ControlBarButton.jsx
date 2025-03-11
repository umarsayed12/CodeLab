// New Component: ControlBarButton
import { motion, AnimatePresence } from "framer-motion";

const ControlBarButton = ({ onClick, active, activeColor, inactiveColor, darkMode, title, children }) => {
    const buttonColor = active 
      ? activeColor 
      : darkMode 
        ? inactiveColor?.dark || "bg-slate-800 hover:bg-slate-700 text-cyan-400"
        : inactiveColor?.light || "bg-white hover:bg-blue-100 text-cyan-600";
  
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`p-3 rounded-full transition-all duration-200 shadow-lg ${buttonColor}`}
        title={title}
      >
        {children}
      </motion.button>
    );
  };

  export default ControlBarButton