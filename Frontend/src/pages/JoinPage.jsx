import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "../components";
import { X } from "lucide-react";
import {showErrorToast,showSuccessToast,showWarningToast} from "../util.js/toast";

const JoinPage = () => {
  const isAuthenticated  = useSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(""); // Error state
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError("⚠ Room ID is required!");
      return;
    }
    setError(""); // Clear error if valid
    navigate(`/room/setup`);
  };

  // Function to handle input change and clear error simultaneously
  const handleInputChange = (e) => {
    setRoomId(e.target.value);
    if (error) setError(""); // Remove error as soon as user types
  };

  // Prevent accessing setup if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-all ${
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
              ? "border-2 border-sky-600 bg-slate-800" 
              : "border border-sky-200 bg-white/90 backdrop-blur-sm"
          }`}
        >
          <X className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-6">You must be logged in to access the setup page.</p>
          <motion.button
            onClick={() => navigate("/login", { 
              state: { 
                message: "Please log in to access the setup page.", 
                redirectFrom: "/setup" 
              } 
            })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg transition ${
              darkMode 
                ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white" 
                : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
            }`}
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all ${
      darkMode 
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
        : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
    }`}>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className={`w-full max-w-lg p-6 rounded-lg shadow-xl ${
          darkMode 
            ? "border-2 border-sky-600 bg-slate-800" 
            : "border border-sky-200 bg-white/90 backdrop-blur-sm"
        }`}>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="/Logo/3.png"
            alt="Large Logo"
            className="h-28 drop-shadow-lg hover:scale-105 transition-all duration-300 mx-auto"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`text-2xl font-bold text-center mt-4 ${
              darkMode ? "text-cyan-400" : "text-cyan-600"
            }`}
          >
            Enter Room ID to Join a Meeting
          </motion.p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
            {/* Input Field - Removed visible box */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-lg font-medium border-b-2 focus:outline-none transition-all duration-300 ${
                  darkMode 
                    ? "bg-transparent border-slate-600 text-white focus:border-sky-500 placeholder-gray-400" 
                    : "bg-transparent border-gray-300 focus:border-sky-500 text-gray-800 placeholder-gray-500"
                }`}
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-center font-semibold"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Join Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, boxShadow: "0px 8px 15px rgba(14, 165, 233, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
                darkMode 
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white" 
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
              }`}
            >
              Join Meeting
            </motion.button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JoinPage;