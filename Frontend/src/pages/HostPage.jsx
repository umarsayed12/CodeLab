import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Copy, Check, X } from "lucide-react";
import { Header, Footer } from "../components";

const HostPage = () => {
  const  isAuthenticated  = useSelector((state) => state.auth.isAuth);
  const navigate = useNavigate();
  const [meetingName, setMeetingName] = useState("");
  const [hostName, setHostName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  const generateRoomId = () => {
    if (!meetingName.trim() || !hostName.trim()) {
      setError("⚠ Please fill in both the Meeting Name and Host Name.");
      return;
    }
    setError("");
    const newRoomId = Math.random().toString(36).substring(2, 10);
    setRoomId(newRoomId);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!meetingName.trim() || !hostName.trim() || !roomId) {
      setError("⚠ All fields are required before starting the meeting.");
      return;
    }
    setError("");
    navigate(`/room/setup`);
  };

  // Handles input change and clears the error when user types
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`text-2xl font-bold text-center ${
              darkMode ? "text-cyan-400" : "text-cyan-600"
            }`}
          >
            Host a New Meeting
          </motion.p>

          {/* Animated Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-center font-semibold mt-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4">
            {/* Input Fields */}
            <input
              type="text"
              placeholder="Meeting Name"
              value={meetingName}
              onChange={handleInputChange(setMeetingName)}
              className={`w-full px-4 py-3 text-lg font-medium border-b-2 focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? "bg-transparent border-slate-600 text-white focus:border-sky-500 placeholder-gray-400" 
                  : "bg-transparent border-gray-300 focus:border-sky-500 text-gray-800 placeholder-gray-500"
              }`}
              required
            />
            <input
              type="text"
              placeholder="Host Name"
              value={hostName}
              onChange={handleInputChange(setHostName)}
              className={`w-full px-4 py-3 text-lg font-medium border-b-2 focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? "bg-transparent border-slate-600 text-white focus:border-sky-500 placeholder-gray-400" 
                  : "bg-transparent border-gray-300 focus:border-sky-500 text-gray-800 placeholder-gray-500"
              }`}
              required
            />

            {/* Generate Room ID Button */}
            <motion.button
              type="button"
              onClick={generateRoomId}
              whileHover={{ scale: 1.03, boxShadow: "0px 8px 15px rgba(14, 165, 233, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
                darkMode 
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white" 
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
              }`}
            >
              Generate Room ID
            </motion.button>

            {/* Room ID Display & Copy Button */}
            {roomId && (
              <div className={`flex items-center justify-between px-4 py-2 rounded-lg mt-2 ${
                darkMode ? "bg-slate-700" : "bg-sky-50"
              }`}>
                <span className={`text-lg font-semibold ${
                  darkMode ? "text-sky-400" : "text-sky-600"
                }`}>
                  {roomId}
                </span>
                <motion.button
                  type="button"
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-md shadow-md text-white ${
                    darkMode 
                      ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500"
                      : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
                  }`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </motion.button>
              </div>
            )}

            {/* Start Meeting Button */}
            <motion.button
              type="submit"
              whileHover={!roomId ? {} : { scale: 1.03, boxShadow: "0px 8px 15px rgba(14, 165, 233, 0.3)" }}
              whileTap={!roomId ? {} : { scale: 0.95 }}
              className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300 text-white
                ${!roomId ? "opacity-50 cursor-not-allowed " : ""}
                ${darkMode 
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500" 
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
                }`}
              disabled={!roomId}
            >
              Start Meeting
            </motion.button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostPage;