import { useState, useEffect ,useRef } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header, Footer, LoadingScreen } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { LogIn, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toast";
import { login } from "../redux/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuth);

  
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isHovered, setIsHovered] = useState(false);
 // Use a ref to track if message has been shown
 const messageShownRef = useRef(false);
  //using setlocation we have the error msg from where we were trying to loggin and redirect to login page we use this to show the error msg
  useEffect(() => {
    // Check if there's a redirect message from another page
    if (location.state?.message && !messageShownRef.current) {
      messageShownRef.current = true;
      showWarningToast(location.state.message);
       // Clear the message so it doesn't show again on re-renders
    // navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const user = { email, password };
    const url = "https://codelab-sq6v.onrender.com/user/login";

    axios
      .post(url, user, { withCredentials: true })
      .then((response) => {
        setIsLoading(false);
        if (response.data.status === "warning") {
          showWarningToast(response.data.message);
        } else if (response.data.status === "error") {
          showErrorToast(response.data.message);
        } else if (response.data.status === "success") {
          showSuccessToast(response.data.message);
          dispatch(login(response.data.user));
          
          // Check if there's a redirect destination
          // using setlocation will auto redirect to the page from where the user was redirected to the login page after logged in
          if (location.state?.redirectFrom) {
            navigate(location.state.redirectFrom);
          } else {
            navigate("/");
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        // console.log("loggin catch")
        showErrorToast(err.response?.data?.message || "Something went wrong!");
      });
  };

  // Loading Screen Component
  if (isLoading) {
    return <LoadingScreen 
      title="Logging in" 
      message="Please wait while we Authenticating you..." 
    />;
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
          className={`w-full max-w-md p-6 rounded-lg shadow-lg transition-all duration-200 ${
            darkMode
              ? "border-2 border-cyan-600 bg-gradient-to-b from-slate-800 to-slate-900"
              : "border-2 border-teal-400 bg-gradient-to-b from-white to-cyan-50"
          }`}
        >
          <NavLink to="/" className="flex items-center justify-center">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              src="/Logo/3.png"
              alt="Logo"
              className="h-32 drop-shadow-lg hover:scale-105 transition-all duration-300"
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
            Login to Your Account
          </motion.p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-6">
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 text-lg font-medium border-b-2 focus:outline-none transition-all duration-300 ${
                  darkMode
                    ? "bg-transparent border-slate-600 text-white focus:border-cyan-500 placeholder-gray-400"
                    : "bg-transparent border-gray-300 focus:border-teal-500 text-gray-800 placeholder-gray-500"
                } ${isHovered ? (darkMode ? "border-cyan-400" : "border-teal-400") : ""}`}
                required
              />
            </div>
            
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 text-lg font-medium border-b-2 pr-12 focus:outline-none transition-all duration-300 ${
                  darkMode
                    ? "bg-transparent border-slate-600 text-white focus:border-cyan-500 placeholder-gray-400"
                    : "bg-transparent border-gray-300 focus:border-teal-500 text-gray-800 placeholder-gray-500"
                } ${isHovered ? (darkMode ? "border-cyan-400" : "border-teal-400") : ""}`}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className={`absolute right-3 top-3 ${
                  darkMode ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 5px 10px rgba(14, 165, 233, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                  : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              }`}
            >
              <LogIn className="mr-2" size={20} />
              Login
            </motion.button>

            <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Don't have an account?{" "}
              <span 
                onClick={() => navigate("/signup")} 
                className={`cursor-pointer hover:underline ${
                  darkMode ? "text-cyan-400" : "text-cyan-600"
                }`}
              >
                Sign up
              </span>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default LoginPage;