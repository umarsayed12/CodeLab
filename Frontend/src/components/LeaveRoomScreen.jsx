import React from 'react';
import { motion } from 'framer-motion';

const LeaveRoomModal = ({ 
  onDownload, 
  onLeave, 
  timer,
  darkMode = false // Add a prop to toggle dark mode
}) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={`
          w-full max-w-md p-6 rounded-lg shadow-lg transition-all duration-200 relative
          ${darkMode
            ? "border-2 border-sky-600 bg-gradient-to-b from-slate-800 to-slate-900"
            : "border-2 border-sky-400 bg-gradient-to-b from-white to-sky-50"
          }
        `}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        whileHover={{
          scale: 1.01,
          boxShadow: darkMode
            ? "0 0 15px rgba(2, 132, 199, 0.4)"
            : "0 0 15px rgba(6, 182, 212, 0.25)"
        }}
        transition={{ duration: 0.3 }}
      >
        <h2 className={`
          text-2xl font-bold text-center mb-4
          ${darkMode ? "text-cyan-400" : "text-sky-600"}
        `}>
          Room Host Left the Meeting
        </h2>
        
        <p className={`
          text-center mb-4
          ${darkMode ? "text-gray-300" : "text-gray-600"}
        `}>
          The host has left the collaborative session. 
          Would you like to download the current code?
        </p>
        
        <div className="flex justify-center space-x-4 mt-6">
          <motion.button 
            onClick={onDownload}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 5px 10px rgba(14, 165, 233, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${darkMode
                ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white"
                : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
              }
            `}
          >
            Download Code
          </motion.button>
          
          <motion.button 
            onClick={onLeave}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 5px 10px rgba(239, 68, 68, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${darkMode
                ? "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              }
            `}
          >
            Leave Room
          </motion.button>
        </div>
        
        <p className={`
          mt-4 text-sm text-center
          ${darkMode ? "text-gray-400" : "text-gray-500"}
        `}>
          Automatically leaving in {timer} seconds
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LeaveRoomModal;