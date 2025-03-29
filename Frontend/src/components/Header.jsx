import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ThemeButton from "./ThemeButton";
import ProfilePanel from "./ProfilePanel";

const Header = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state) => state.auth.userData);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  const handleProfilePanelToggle = (value) => {
    setShowProfilePanel(value);
    if (value && isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header Container */}
      <header
        className={`flex justify-between items-center p-4 shadow-md border-b transition-all 
          ${
            darkMode
              ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-gray-900 text-white"
              : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 border-gray-200 text-gray-800"
          }`}
      >
        {/* Left Side - Logo */}
        <NavLink to="/" className="flex items-center">
          <motion.img
            src="/Logo/3.png"
            alt="Logo"
            className="h-16 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </NavLink>

        {/* Right Side - Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeButton />
          <NavLink
            to="/join"
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all 
              ${
                darkMode
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                  : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              }`}
          >
            Join
          </NavLink>
          <NavLink
            to="/host"
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all 
              ${
                darkMode
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white"
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
              }`}
          >
            Host
          </NavLink>

          {/* Show profile image if authenticated */}
          {isAuthenticated && (
            <motion.img
              src={user?.profileImage ? `https://codelab-sq6v.onrender.com/${user.profileImage}` : "/images/man.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer shadow-lg border-2 border-cyan-400 object-cover"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleProfilePanelToggle(true)}
            />
          )}

          {/* Show loading indicator when authentication is in progress */}
          {isLoading && (
            <div
              className={`w-10 h-10 rounded-full shadow-lg border-2 border-cyan-400 ${
                darkMode ? "bg-slate-800" : "bg-gray-100"
              } flex items-center justify-center`}
            >
              <motion.div
                className="w-6 h-6 border-t-2 border-cyan-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded-lg shadow-md transition-all ${
            darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white hover:bg-gray-100"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden flex flex-col items-center space-y-4 p-4 shadow-md transition-all 
              ${darkMode
              ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-gray-900 text-white"
              : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 border-gray-200 text-gray-800" }`}
          >
            <ThemeButton />
            <NavLink
              to="/join"
              className={`w-full text-center py-2 rounded-lg transition-all ${
                darkMode
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                  : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Join
            </NavLink>
            <NavLink
              to="/host"
              className={`w-full text-center py-2 rounded-lg transition-all ${
                darkMode
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white"
                  : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Host
            </NavLink>

            {/* Show profile image in mobile menu if authenticated */}
            {isAuthenticated && (
              <motion.img
                src={user?.profileImage ? `https://codelab-sq6v.onrender.com/${user.profileImage}` : "/images/man.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full cursor-pointer shadow-lg border-2 border-cyan-400 object-cover"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  handleProfilePanelToggle(true);
                  setIsMenuOpen(false);
                }}
              />
            )}

            {/* Show loading indicator when authentication is in progress */}
            {isLoading && (
              <div
                className={`w-12 h-12 rounded-full shadow-lg border-2 border-cyan-400 ${
                  darkMode ? "bg-slate-800" : "bg-gray-100"
                } flex items-center justify-center`}
              >
                <motion.div
                  className="w-6 h-6 border-t-2 border-cyan-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Panel */}
      <AnimatePresence>
        <ProfilePanel panelOpen={showProfilePanel} onClose={() => handleProfilePanelToggle(false)} />
      </AnimatePresence>
    </>
  );
};

export default Header;
