import { motion, AnimatePresence } from "framer-motion";
import {X} from "lucide-react";
import ParticipantsList from "./ParticipantsList";
import ChatMessages from "./ChatMessages";
const Sidebar = ({ 
    show, content, onClose, host,setHost,
    socket, roomId,participants, messages, setMessages ,
    darkMode 
  }) => {
    if (!show) return null;
    
    return (
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`w-80 transition-all duration-300 ease-in-out flex flex-col overflow-hidden shadow-xl ${
          darkMode 
            ? "bg-slate-900 border-l border-indigo-900" 
            : "bg-white border-l border-blue-200"
        }`}
      >
        {/* Sidebar Header with gradient */}
        <div className={`flex items-center p-3 border-b ${
          darkMode 
            ? "bg-gradient-to-r from-slate-900 to-indigo-950 border-indigo-900" 
            : "bg-gradient-to-r from-white to-blue-50 border-blue-200"
        }`}>
          <h3 className={`text-lg font-semibold flex-grow ${
            darkMode ? "text-cyan-400" : "text-cyan-600"
          }`}>
            {content === "participants" ? "Participants" : "Chat"}
          </h3>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              darkMode 
                ? "hover:bg-slate-800 text-cyan-400" 
                : "hover:bg-blue-50 text-cyan-600"
            }`}
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="flex-grow overflow-auto">
          {content === "participants" ? (
            <ParticipantsList participants={participants} darkMode={darkMode} roomId={roomId} />
          ) : (
            <ChatMessages 
            socket={socket}
            roomId={roomId}
              messages={messages} 
              setMessages={setMessages}
              darkMode={darkMode} 
            />
          )}
        </div>
      </motion.div>
    );
  };

  export default Sidebar;