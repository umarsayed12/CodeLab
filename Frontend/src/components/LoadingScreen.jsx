// import React from "react";
// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";
// const LoadingScreen = ({ title = "Loading", message = "Please wait..." }) => {
//   const darkMode = useSelector((state) => state.theme.darkMode);

//   return (
//     <div className={`flex-grow flex flex-col items-center justify-center transition-all ${
//       darkMode 
//         ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
//         : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
//     }`}>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className={`p-8 rounded-xl shadow-xl text-center ${
//           darkMode 
//             ? "border-2 border-sky-600 bg-slate-800/80 backdrop-blur-sm" 
//             : "border border-sky-200 bg-white/90 backdrop-blur-sm"
//         }`}
//       >
//         <div className="flex flex-col items-center justify-center">
//           {/* Pulsing circle animation */}
//           <div className="relative mb-6">
//             <motion.div
//               className={`w-16 h-16 rounded-full ${
//                 darkMode ? "bg-sky-600" : "bg-sky-500"
//               }`}
//               animate={{
//                 scale: [1, 1.2, 1],
//                 opacity: [0.7, 0.9, 0.7]
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             />
//             <motion.div
//               className={`absolute inset-0 w-16 h-16 rounded-full ${
//                 darkMode ? "border-4 border-cyan-400" : "border-4 border-cyan-500"
//               }`}
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [1, 0, 1]
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             />
//           </div>
          
//           <h2 className={`text-2xl font-bold mb-2 ${
//             darkMode ? "text-cyan-400" : "text-cyan-600"
//           }`}>
//             {title}
//           </h2>
          
//           <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
//             {message}
//           </p>
          
//           {/* Animated dots */}
//           <div className="flex space-x-2 mt-4">
//             {[0, 1, 2].map((index) => (
//               <motion.div
//                 key={index}
//                 className={`w-3 h-3 rounded-full ${
//                   darkMode ? "bg-sky-500" : "bg-sky-500"
//                 }`}
//                 animate={{
//                   scale: [1, 1.5, 1],
//                   opacity: [0.7, 1, 0.7]
//                 }}
//                 transition={{
//                   duration: 1,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                   delay: index * 0.2
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoadingScreen;

import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const LoadingScreen = ({ title = "Loading", message = "Please wait..." }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all ${
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
            ? "border-2 border-sky-600 bg-slate-800/80 backdrop-blur-sm" 
            : "border border-sky-200 bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Pulsing circle animation */}
          <div className="relative mb-6">
            <motion.div
              className={`w-16 h-16 rounded-full ${
                darkMode ? "bg-sky-600" : "bg-sky-500"
              }`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className={`absolute inset-0 w-16 h-16 rounded-full ${
                darkMode ? "border-4 border-cyan-400" : "border-4 border-cyan-500"
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? "text-cyan-400" : "text-cyan-600"
          }`}>
            {title}
          </h2>
          
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            {message}
          </p>
          
          {/* Animated dots */}
          <div className="flex space-x-2 mt-4">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  darkMode ? "bg-sky-500" : "bg-sky-500"
                }`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;