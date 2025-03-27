import { useState, useEffect ,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate, NavLink  , useLocation, redirect} from "react-router-dom";
import { Header, Footer, LoadingScreen, AccessDeniedScreen } from "../components";
import { X } from "lucide-react";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../utils/toast";

const JoinPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  //using setlocation we have the error msg from where we were trying to loggin and redirect to login page we use this to show the error msg
  const messageShownRef = useRef(false);
  //using setlocation we have the error msg from where we were trying to loggin and redirect to login page we use this to show the error msg
  useEffect(() => {
    // Check if there's a redirect message from another page
    if (location.state?.message && !messageShownRef.current) {
      messageShownRef.current = true;
      showWarningToast(location.state.message);
       // Clear the message so it doesn't show again on re-renders
    // navigate(location?.pathname, { replace: true, state: {} });
    }
  }, [location]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setTimeout(() => {
        navigate("/login" , { state: { message: "⚠ You need to login first!" ,
          redirectFrom: "/join"
         } });
      }, 3000);
    }
  }, [isAuthenticated, isLoading, navigate]);



  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      showWarningToast("⚠ Room ID is required!");
      return;
    }
    navigate(`/room/setup`);
  };

  const handleInputChange = (e) => {
    setRoomId(e.target.value);
  };

  // Enhanced Loading State - Matching HostPage
  if (isLoading) {
    return (
      <LoadingScreen title="Loading" message="Verifying your credentials..." />
    );
  }

  // ❌ Access Denied UI if NOT Authenticated
  if (!isAuthenticated) {
    return <AccessDeniedScreen darkMode={darkMode} navigate={navigate}  redirectPath="/login" />;
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
              ? "0 0 15px rgba(8, 145, 178, 0.4)" 
              : "0 0 15px rgba(20, 184, 166, 0.25)" 
          }}
          transition={{ duration: 0.3 }}
          className={`w-full max-w-lg p-6 rounded-lg shadow-lg transition-all duration-200 ${
            darkMode
              ? "border-2 border-cyan-600 bg-gradient-to-b from-slate-800 to-slate-900"
              : "border-2 border-teal-400 bg-gradient-to-b from-white to-cyan-50"
          }`}
        >
          <NavLink to="/" className="flex items-center">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src="/Logo/3.png"
              alt="Large Logo"
              className="h-28 drop-shadow-lg hover:scale-105 transition-all duration-300 mx-auto"
            />
          </NavLink>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`text-2xl font-bold text-center mt-4 ${
              darkMode ? "text-cyan-400" : "text-teal-600"
            }`}
          >
            Enter Room ID to Join a Meeting
          </motion.p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col space-y-4"
          >
            {/* Input Field */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-lg font-medium border-b-2 focus:outline-none transition-all duration-300 ${
                  darkMode
                    ? "bg-transparent border-slate-600 text-white focus:border-cyan-500 placeholder-gray-400"
                    : "bg-transparent border-gray-300 focus:border-teal-500 text-gray-800 placeholder-gray-500"
                } ${isHovered ? (darkMode ? "border-cyan-400" : "border-teal-400") : ""}`}
              />
            </div>

            {/* Error Message */}
            {/* <AnimatePresence>
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
            </AnimatePresence> */}

            {/* Join Button */}
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 5px 10px rgba(14, 165, 233, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                  : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              }`}
            >
              Join Meeting
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default JoinPage;