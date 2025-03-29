import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector , useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Copy, Check, X } from "lucide-react";
import { Header, Footer, LoadingScreen, AccessDeniedScreen } from "../components";
import axios from "axios";
import {
  showWarningToast , 
  showSuccessToast ,
  showErrorToast
} from "../utils/toast";
import { setLoading } from "../redux/authSlice";


const HostPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const userData = useSelector((state) => state.auth.userData);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const navigate = useNavigate();
  const [meetingName, setMeetingName] = useState("");
  const [hostName, setHostName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [copied, setCopied] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isHovered, setIsHovered] = useState(false);
const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [isAuthenticated, isLoading, navigate]);

  const generateRoomId = () => {
    if (!meetingName.trim() || !hostName.trim()) {
      showErrorToast("⚠ All fields are required before generating a room ID.");
      return;
    }
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
   dispatch(setLoading(true));
    const url = `http://localhost:5000/room/create-room`;
    const FormData = {
      meetingName: meetingName,
      hostName: hostName,
      roomId: roomId,
      host:userData,
    };
    axios.post(url, FormData , { withCredentials: true })
    .then((response) => {
      dispatch(setLoading(false));
      if (response.data.status === "success") {
        showSuccessToast(response.data.message);
    navigate("/room/setup", { state: { roomId } });
      } else if(response.data.status === "warning") {
        showWarningToast(response.data.message);
      }
      else if(response.data.status === "error") {
        showErrorToast(response.data.message);
      }
  }).catch((err) => {
    dispatch(setLoading(false));
    showErrorToast(err.response?.data?.message || "Something went wrong!");
  }
  );
  };

  // Handles input change and clears the error when user types
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Loading state
  if (isLoading) {
    return (
      <LoadingScreen
        title="Loading"
        message="Verifying your credentials..."
      />
    );
  }

  // Prevent accessing setup if not authenticated
  if (!isAuthenticated) {
    return <AccessDeniedScreen darkMode={darkMode} navigate={navigate} />;
  }

  return (
    <div
      className={`flex-grow flex flex-col transition-all ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white"
          : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
      }`}
    >
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{
            scale: 1.01,
            boxShadow: darkMode
              ? "0 0 15px rgba(2, 132, 199, 0.4)"
              : "0 0 15px rgba(6, 182, 212, 0.25)"
          }}
          transition={{ duration: 0.3 }}
          className={`w-full max-w-lg p-6 rounded-lg shadow-lg transition-all duration-200 ${
            darkMode
              ? "border-2 border-sky-600 bg-gradient-to-b from-slate-800 to-slate-900"
              : "border-2 border-sky-400 bg-gradient-to-b from-white to-sky-50"
          }`}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`text-2xl font-bold text-center ${
              darkMode ? "text-cyan-400" : "text-sky-600"
            }`}
          >
            Host a New Meeting
          </motion.p>

          {/* Animated Error Message */}
          {/* <AnimatePresence>
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
          </AnimatePresence> */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col space-y-4"
          >
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
              } ${isHovered ? (darkMode ? "border-sky-400" : "border-sky-400") : ""}`}
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
              } ${isHovered ? (darkMode ? "border-sky-400" : "border-sky-400") : ""}`}
              required
            />

            {/* Generate Room ID Button */}
            <motion.button
              type="button"
              onClick={generateRoomId}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 5px 10px rgba(14, 165, 233, 0.2)"
              }}
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
              <div
                className={`flex items-center justify-between px-4 py-2 rounded-lg mt-2 ${
                  darkMode ? "bg-slate-700" : "bg-sky-50"
                }`}
              >
                <span
                  className={`text-lg font-semibold ${
                    darkMode ? "text-sky-400" : "text-sky-600"
                  }`}
                >
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
              whileHover={
                !roomId
                  ? {}
                  : {
                      scale: 1.03,
                      boxShadow: "0px 5px 10px rgba(14, 165, 233, 0.2)"
                    }
              }
              whileTap={!roomId ? {} : { scale: 0.95 }}
              className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300 text-white
                ${!roomId ? "opacity-50 cursor-not-allowed " : ""}
                ${
                  darkMode
                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500"
                    : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
                }`}
              disabled={!roomId}
            >
              Start Meeting
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default HostPage;