

const AccessDeniedScreen = ({ darkMode, navigate }) => {
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
          <p className="mb-6">You must be logged in to access the room.</p>
          <motion.button
            onClick={() => navigate("/login", { 
              state: { 
                message: "Please log in to access the room.", 
                redirectFrom: "/room" 
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
  };

  export default AccessDeniedScreen;