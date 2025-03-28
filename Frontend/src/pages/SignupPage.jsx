import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Header, Footer, LoadingScreen } from "../components";
import { useSelector } from "react-redux";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { showErrorToast, showSuccessToast, showWarningToast } from "../utils/toast";
import axios from "axios";
import { setLoading } from "../redux/authSlice";
const SignupPage = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isHovered, setIsHovered] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    
    // Create preview URL for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("fullname", name);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      const url = "https://codelab-sq6v.onrender.com/user/signup";
      
      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log("After Fetching in repsonse Query : Frontend");
      setIsLoading(false);
      if (response.data.status === "warning") {
        showWarningToast(response.data.message);
      }
      else if (response.data.status === "error") {
        showErrorToast(response.data.message);
      }else{
      showSuccessToast(response.data.message);
      navigate("/login");
      }
  
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Something went wrong!");
      setIsLoading(false);
    }
  };
  
  // Use the LoadingScreen component when loading
  if (isLoading) {
    return <LoadingScreen 
      title="Creating Account" 
      message="Please wait while we process your registration..." 
    />;
  }

  return (
    <div className={`flex-grow flex flex-col transition-all ${
      darkMode 
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
        : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
    }`}>
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
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
          className={`w-full max-w-md p-6 rounded-lg shadow-lg transition-all duration-200 relative ${
            darkMode
              ? "border-2 border-sky-600 bg-gradient-to-b from-slate-800 to-slate-900"
              : "border-2 border-sky-400 bg-gradient-to-b from-white to-sky-50"
          }`}
        >
          {/* Profile Picture Preview - Positioned at the top overlapping with the container border */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`rounded-full w-20 h-20 overflow-hidden shadow-lg ${
                darkMode 
                  ? "border-2 border-sky-600 bg-slate-700"
                  : "border-2 border-sky-400 bg-blue-50"
              }`}
            >
              {profilePreview ? (
                <img 
                  src={profilePreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`text-2xl font-bold text-center mt-11 ${
              darkMode ? "text-cyan-400" : "text-sky-600"
            }`}
          >
            Create Account
          </motion.p>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-4" encType="multipart/form-data">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
               
              }}
              className={`w-full px-4 py-3 text-lg font-medium border-b-2 focus:outline-none transition-all duration-300 ${
                darkMode
                  ? "bg-transparent border-slate-600 text-white focus:border-sky-500 placeholder-gray-400"
                  : "bg-transparent border-gray-300 focus:border-sky-500 text-gray-800 placeholder-gray-500"
              } ${isHovered ? (darkMode ? "border-sky-400" : "border-sky-400") : ""}`}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
               
              }}
              className={`w-full px-4 py-3 text-lg font-medium border-b-2 focus:outline-none transition-all duration-300 ${
                darkMode
                  ? "bg-transparent border-slate-600 text-white focus:border-sky-500 placeholder-gray-400"
                  : "bg-transparent border-gray-300 focus:border-sky-500 text-gray-800 placeholder-gray-500"
              } ${isHovered ? (darkMode ? "border-sky-400" : "border-sky-400") : ""}`}
              required
            />
            
            {/* Password field with show/hide toggle */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                 
                }}
                className={`w-full px-4 py-3 text-lg font-medium border-b-2 focus:outline-none transition-all duration-300 ${
                  darkMode
                    ? "bg-transparent border-slate-600 text-white focus:border-sky-500 placeholder-gray-400"
                    : "bg-transparent border-gray-300 focus:border-sky-500 text-gray-800 placeholder-gray-500"
                } ${isHovered ? (darkMode ? "border-sky-400" : "border-sky-400") : ""}`}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-700"
                } transition-colors focus:outline-none`}
              >
                {showPassword ? (
                  <EyeOff size={18} className="cursor-pointer" />
                ) : (
                  <Eye size={18} className="cursor-pointer" />
                )}
              </button>
            </div>
            
            <div className="flex flex-col">
              <label className={`text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full px-4 py-2 rounded-lg text-sm border transition-all duration-300 ${
                  darkMode 
                    ? "bg-transparent border border-slate-600 text-gray-300 focus:border-sky-500" 
                    : "bg-transparent border border-gray-300 text-gray-700 focus:border-sky-500"
                } ${isHovered ? (darkMode ? "border-sky-400" : "border-sky-400") : ""}`}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 5px 10px rgba(14, 165, 233, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white"
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
              }`}
            >
              <UserPlus className="mr-2" size={20} />
              Sign Up
            </motion.button>

            <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Already have an account?{" "}
              <span
                className={`cursor-pointer hover:underline ${
                  darkMode ? "text-cyan-400" : "text-cyan-600"
                }`}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default SignupPage;