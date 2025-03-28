

//  NEW ACCESS DENIED SCREEN FOR THE GOOD HANDKIG WITH TIMEOUT AND LOCATION STATE 

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from "lucide-react";

const AccessDeniedScreen = ({ 
  darkMode, 
  navigate, 
  redirectPath = "/", 
  redirectTimer = 4,
  title = "Access Denied",
  message = "You must be logged in to access the room.",
  redirectMessage = "Redirecting in",
  redirectState = {}
}) => {
  const [countdown, setCountdown] = useState(redirectTimer);

  useEffect(() => {
    // If countdown reaches 0, navigate to the specified path
    if (countdown === 0) {
      navigate(redirectPath, { 
        state: { 
          message: message, 
          redirectFrom: window.location.pathname,
          ...redirectState
        } 
      });
      return;
    }

    // Set up the interval
    const timer = setInterval(() => {
      setCountdown(prevCount => prevCount - 1);
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, [countdown, navigate, redirectPath, redirectState]);

  const handleClose = () => {
    navigate(redirectPath, { 
      state: { 
        message: message, 
        redirectFrom: window.location.pathname,
        ...redirectState
      } 
    });
  };

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
        className={`p-8 rounded-xl shadow-xl text-center relative ${
          darkMode
          ? "border-2 border-cyan-600 bg-gradient-to-b from-slate-800 to-slate-900"
          : "border-2 border-teal-400 bg-gradient-to-b from-white to-cyan-50"
        }`}
      >
        {/* Close Icon */}
        <motion.div
          onClick={handleClose}
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-4 right-4 cursor-pointer ${
            darkMode 
              ? "text-gray-300 hover:text-white" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <X size={24} />
        </motion.div>

        <X className="mx-auto mb-4 text-red-500" size={48} />
        <h2 className={`text-2xl font-bold mb-4 ${
          darkMode ? "text-cyan-400" : "text-sky-600"
        }`}>
          {title}
        </h2>
        <p className={`mb-6 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}>
          {message}
        </p>
        
        {/* buttons can be implemented here  */}

        <p className={`text-sm mb-4 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}>
          {redirectMessage} {countdown} seconds
        </p>
      </motion.div>
    </div>
  );
};

export default AccessDeniedScreen;


{/* <motion.button
          onClick={() => navigate(redirectPath, { 
            state: { 
              message: "Please log in to access the room.", 
              redirectFrom: window.location.pathname,
              ...redirectState
            } 
          })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-lg transition mb-4 ${
            darkMode
            ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
            : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
          }`}
        >
          Go to Login
        </motion.button> */}