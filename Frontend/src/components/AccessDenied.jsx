
import { motion, AnimatePresence } from "framer-motion";
import {X} from "lucide-react";
const AccessDeniedScreen = ({ darkMode, navigate }) => {
    return (
      <div className={`flex-grow flex flex-col items-center justify-center transition-all ${
        darkMode 
          ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
          : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-8 rounded-xl shadow-xl text-center ${
            darkMode
            ? "border-2 border-cyan-600 bg-gradient-to-b from-slate-800 to-slate-900"
            : "border-2 border-teal-400 bg-gradient-to-b from-white to-cyan-50"

          }`}
        >
          <X className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-6">You must be logged in to access the room.</p>
          <motion.button
            onClick={() => navigate("/login", { 
              state: { 
                message: "Please log in to access the room.", 
                redirectFrom: "/room" 
              } 
            })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg transition ${
              darkMode
              ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
              : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
            }`}
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  };

  export default AccessDeniedScreen;