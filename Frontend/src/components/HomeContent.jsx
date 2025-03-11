import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { LogIn, UserPlus, Video, MonitorUp } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import { useEffect } from "react";
import { checkAuth } from "../redux/authSlice"; // Adjust the path as needed
import LoadingScreen from "./LoadingScreen"; // Adjust the path as needed

const HomeContent = () => {
  const dispatch = useDispatch();
  const { isAuth, isLoading } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme.darkMode);

  // Check auth status when component mounts
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading screen while authentication is being checked
  if (isLoading) {
    return <LoadingScreen title="Initializing" message="Checking authentication status..." />;
  }

  return (
    <main
      className={`flex-grow flex flex-col items-center justify-center p-6 space-y-8 
        transition-all ${
          darkMode 
            ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
            : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
        }`}
    >
      {/* Logo with Animation */}
      <NavLink to="/" className="flex items-center">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src="/Logo/3.png"
          alt="Large Logo"
          className="h-28 drop-shadow-lg hover:scale-105 transition-all duration-300"
        />
      </NavLink>

      {/* Typewriter Effect for Dynamic Text */}
      <h2
        className={`text-2xl font-bold text-center transition-all duration-500 ease-in-out transform 
          hover:scale-110 hover:drop-shadow-2xl 
          ${darkMode 
            ? "text-cyan-300 drop-shadow-glow-dark hover:text-cyan-200 hover:drop-shadow-glow-strong-dark" 
            : "text-cyan-600 drop-shadow-glow-light hover:text-cyan-500 hover:drop-shadow-glow-strong-light"}`}
      >
        <Typewriter
          words={[
            "🚀 Collaborate in real-time",
            "💻 Code together seamlessly",
            "🌍 Connect with developers worldwide",
            "⚡ Boost productivity with live coding",
            "🎓 Learn and grow with your peers",
          ]}
          loop={0} // Infinite loop
          cursor
          cursorStyle="|"
          typeSpeed={50}
          deleteSpeed={30}
          delaySpeed={1500}
        />
      </h2>

      {/* Buttons */}
      {isAuth ? (
        <div className="flex space-x-4">
          <Link to="/join">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0px 10px 20px rgba(6, 182, 212, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center px-6 py-3 rounded-lg shadow-md transition-all ${
                darkMode 
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white" 
                  : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              }`}
            >
              <Video className="mr-2" size={22} />
              Join Meeting
            </motion.button>
          </Link>
          <Link to="/host">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0px 10px 20px rgba(14, 165, 233, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center px-6 py-3 rounded-lg shadow-md transition-all ${
                darkMode 
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white" 
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
              }`}
            >
              <MonitorUp className="mr-2" size={22} />
              Host Meeting
            </motion.button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0px 10px 20px rgba(6, 182, 212, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg shadow-md transition-all ${
                darkMode 
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white" 
                  : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              }`}
            >
              <LogIn className="mr-2" size={22} />
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0px 10px 20px rgba(14, 165, 233, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
                darkMode 
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white" 
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
              }`}
            >
              <UserPlus className="mr-2" size={22} />
              Sign Up
            </motion.button>
          </Link>
        </div>
      )}
    </main>
  );
};

export default HomeContent;