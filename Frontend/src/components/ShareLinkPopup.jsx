
import { motion, AnimatePresence } from "framer-motion";
import {Copy,  X, Check} from "lucide-react"
const ShareLinkPopup = ({ show, roomLink, isCopied, setIsCopied, onClose, darkMode }) => {
    if (!show) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.2 }}
        className={`fixed top-10 left-1/2 transform -translate-x-1/2 p-6 rounded-xl shadow-2xl w-96 z-50 ${
          darkMode 
            ? "bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-800" 
            : "bg-gradient-to-r from-white to-blue-50 text-gray-800 border border-blue-200"
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-lg font-semibold ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>
            Share Room Link
          </h3>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={`flex items-center p-3 rounded-lg mb-4 border ${
          darkMode 
            ? "bg-slate-800 bg-opacity-50 border-indigo-900" 
            : "bg-blue-50 bg-opacity-50 border-blue-200"
        }`}>
          <div className="flex-grow truncate mr-2 font-mono text-sm">
            {roomLink}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomLink);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            className={`p-2 rounded-lg transition-colors text-white flex items-center shadow-md ${
              isCopied 
                ? "bg-green-500" 
                : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500"
            }`}
          >
            {isCopied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
        
        <p className={darkMode ? "text-gray-300 text-sm" : "text-gray-600 text-sm"}>
          Share this link with others to invite them to join your collaborative coding session.
        </p>
      </motion.div>
    );
  };
  export default ShareLinkPopup;