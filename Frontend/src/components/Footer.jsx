import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { useSelector } from "react-redux";

const Footer = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <footer className={`p-6 border-t shadow-md transition-all duration-300
      ${darkMode 
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-gray-800" 
        : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 border-gray-200"}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className={`text-sm transition-colors duration-300 
            ${darkMode 
              ? "text-gray-300 hover:text-white" 
              : "text-gray-700 hover:text-gray-900"}`}>
            © {new Date().getFullYear()} <span className={`font-semibold 
              ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>CodeCollab</span>. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          {/* GitHub */}
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.3, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-300 hover:drop-shadow-lg
              ${darkMode 
                ? "text-gray-300 hover:text-white" 
                : "text-gray-700 hover:text-gray-900"}`}
          >
            <FaGithub size={24} />
          </motion.a>
          {/* Twitter */}
          <motion.a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.3, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-300 hover:drop-shadow-lg
              ${darkMode 
                ? "text-gray-300 hover:text-cyan-400" 
                : "text-gray-700 hover:text-cyan-600"}`}
          >
            <FaTwitter size={24} />
          </motion.a>
          {/* LinkedIn */}
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.3, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-300 hover:drop-shadow-lg
              ${darkMode 
                ? "text-gray-300 hover:text-sky-400" 
                : "text-gray-700 hover:text-sky-600"}`}
          >
            <FaLinkedin size={24} />
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;