import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header, Footer } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { LogIn, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../util.js/toast";
import { login } from "../redux/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    const url = "http://localhost:5000/user/login";

    axios
      .post(url, user)
      .then((response) => {
        if (response.data.status === "warning") {
          showWarningToast(response.data.message);
        } else if (response.data.status === "error") {
          showErrorToast(response.data.message);
        } else if (response.data.status === "success") {
          showSuccessToast(response.data.message);
          dispatch(login(response.data.user));
          navigate("/");
        }
      })
      .catch((err) => {
        showErrorToast(err.response?.data?.message || "Something went wrong!");
      });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white"
          : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
      }`}
    >
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div
          className={`w-full max-w-md p-6 rounded-lg shadow-xl ${
            darkMode
              ? "border-2 border-cyan-600 bg-slate-800"
              : "border border-sky-200 bg-white/90 backdrop-blur-sm"
          }`}
        >
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="flex justify-center mb-4">
            <img src="/Logo/3.png" alt="Logo" className="h-16 drop-shadow-lg" />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className={`text-2xl font-bold text-center ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>
            Login to Your Account
          </motion.p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-md border ${
                darkMode ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500 placeholder-gray-400" : "bg-blue-50/80 border-gray-300 focus:border-cyan-500 text-gray-800 placeholder-gray-500"
              } focus:outline-none`}
              required
            />
            
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-md border pr-12 ${
                  darkMode ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500 placeholder-gray-400" : "bg-blue-50/80 border-gray-300 focus:border-cyan-500 text-gray-800 placeholder-gray-500"
                } focus:outline-none`}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(6, 182, 212, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center px-6 py-3 rounded-lg shadow-md transition-all ${
                darkMode ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white" : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              }`}
            >
              <LogIn className="mr-2" size={20} />
              Login
            </motion.button>

            <p className={`text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")} className={`cursor-pointer hover:underline ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>
                Sign up
              </span>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
