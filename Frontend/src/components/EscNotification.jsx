// New Component: EscNotification
import { motion, AnimatePresence } from "framer-motion";
import { X} from "lucide-react";
const EscNotification = ({ show, darkMode, onClose }) => {
    if (!show) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm z-50 flex items-center shadow-xl ${
          darkMode 
            ? "bg-gradient-to-r from-slate-800 to-indigo-900 text-white border border-indigo-700" 
            : "bg-gradient-to-r from-white to-blue-100 text-gray-800 border border-blue-200"
        }`}
      >
        <span className="mr-2">Press ESC to exit fullscreen</span>
        <X size={14} onClick={onClose} className={`cursor-pointer ${darkMode ? "hover:text-cyan-400" : "hover:text-cyan-600"}`} />
      </motion.div>
    );
  };
  export default EscNotification