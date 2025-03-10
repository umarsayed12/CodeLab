import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  MessageCircle,
  Share,
  LogOut,
  Copy,
  Bot,
  X,
  Check,
  Clipboard,
  Settings,
  UserPlus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Header, Footer, CodeEditor, ParticipantsList, ProfilePanel } from "../components";
import { useSelector } from "react-redux";



const RoomPage = () => {
  const navigate = useNavigate();
  const codeEditorRef = useRef(null);
  const isAuthenticated = true;
  const darkMode = useSelector((state) => state.theme.darkMode);
  // Media States
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  
  // Room States
  const [participants, setParticipants] = useState([
    { id: 1, name: "Jane Cooper", avatar: "/avatars/1.png", isHost: true, isActive: true },
    { id: 2, name: "Wade Warren", avatar: "/avatars/2.png", isHost: false, isActive: true },
    { id: 3, name: "Esther Howard", avatar: "/avatars/3.png", isHost: false, isActive: false }
  ]);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Jane Cooper", message: "Let's fix that bug in the auth flow", time: "10:23 AM" },
    { id: 2, sender: "Wade Warren", message: "I think we need to update the API endpoint first", time: "10:25 AM" }
  ]);
  const [roomLink, setRoomLink] = useState("");
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // UI States
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarContent, setSidebarContent] = useState("participants");
  const [newMessage, setNewMessage] = useState("");
  const [isFullScreenApp, setIsFullScreenApp] = useState(false);
  const [showEscNotification, setShowEscNotification] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Please log in to access the room.", redirectFrom: "/room" },
        });
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

 
  // Handle fullscreen toggle for entire application
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isFullScreenApp) {
        setIsFullScreenApp(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    
    if (isFullScreenApp) {
      document.body.style.overflow = "hidden";
      // Show ESC notification for 2 seconds
      setShowEscNotification(true);
      const timer = setTimeout(() => {
        setShowEscNotification(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isFullScreenApp]);

  // Room Controls
  const toggleCamera = () => setIsCameraOn(!isCameraOn);
  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleFullScreenApp = () => {
    setIsFullScreenApp(!isFullScreenApp);
  };

  // Share Room Link with Enhanced Copy
  const shareRoomLink = useCallback(() => {
    const link = `${window.location.origin}/room/${Math.random().toString(36).substring(7)}`;
    setRoomLink(link);
    setShowCopyPopup(true);
    
    // Copy to clipboard
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  }, []);

  // Leave Room with confirmation
  const leaveRoom = () => {
    if (window.confirm("Are you sure you want to leave this collaborative session?")) {
      navigate("/");
    }
  };

  // Toggle Sidebar Content
  const toggleSidebar = (content) => {
    if (showSidebar && sidebarContent === content) {
      setShowSidebar(false);
    } else {
      setSidebarContent(content);
      setShowSidebar(true);
    }
  };

  // Close Copy Popup
  const closeCopyPopup = () => {
    setShowCopyPopup(false);
    setIsCopied(false);
  };

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div 
      className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
        darkMode 
          ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
          : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
      }`}
      style={{
        position: isFullScreenApp ? 'fixed' : 'relative',
        top: isFullScreenApp ? 0 : 'auto',
        left: isFullScreenApp ? 0 : 'auto',
        right: isFullScreenApp ? 0 : 'auto',
        bottom: isFullScreenApp ? 0 : 'auto',
        zIndex: isFullScreenApp ? 9999 : 'auto',
        height: isFullScreenApp ? '100vh' : '100vh',
        width: isFullScreenApp ? '100vw' : '100%',
      }}
    >
      {isFullScreenApp ? null : <Header />}
      
      {/* Main Room Container */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Left Sidebar (Control Bar) - Updated with new color scheme */}
        <div className={`w-16 flex flex-col items-center py-6 space-y-6 shadow-lg z-10 px-2 ${
          darkMode 
            ? "bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900" 
            : "bg-gradient-to-b from-blue-50 to-indigo-100 "
        }`}>
          <div className="space-y-6">
            <motion.button
              onClick={toggleCamera}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                isCameraOn 
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white" 
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              }`}
              title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
            >
              {isCameraOn ? <Video size={22} /> : <VideoOff size={22} />}
            </motion.button>
            
            <motion.button
              onClick={toggleMic}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                isMicOn 
                  ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white" 
                  : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              }`}
              title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
            >
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
            </motion.button>
          </div>
          
          <div className="space-y-6">
            <motion.button
              onClick={() => toggleSidebar("participants")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                showSidebar && sidebarContent === "participants"
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white" 
                  : darkMode 
                    ? "bg-slate-800 hover:bg-slate-700 text-cyan-400" 
                    : "bg-white hover:bg-blue-100 text-cyan-600"
              }`}
              title="Show Participants"
            >
              <Users size={22} />
            </motion.button>
            
            <motion.button
              onClick={() => toggleSidebar("messages")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                showSidebar && sidebarContent === "messages"
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white"
                  : darkMode 
                    ? "bg-slate-800 hover:bg-slate-700 text-cyan-400" 
                    : "bg-white hover:bg-blue-100 text-cyan-600"
              }`}
              title="Show Messages"
            >
              <MessageCircle size={22} />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                darkMode 
                  ? "bg-slate-800 hover:bg-slate-700 text-purple-300" 
                  : "bg-white hover:bg-blue-100 text-purple-600"
              }`}
              title="AI Assistant"
            >
              <Bot size={22} />
            </motion.button>
          </div>
          
          <div className="space-y-6">
            <motion.button
              onClick={shareRoomLink}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                darkMode 
                  ? "bg-slate-800 hover:bg-slate-700 text-cyan-400" 
                  : "bg-white hover:bg-blue-100 text-cyan-600"
              }`}
              title="Share Room Link"
            >
              <Clipboard size={22} />
            </motion.button>
            
            <motion.button
              onClick={toggleFullScreenApp}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                darkMode 
                  ? "bg-slate-800 hover:bg-slate-700 text-cyan-400" 
                  : "bg-white hover:bg-blue-100 text-cyan-600"
              }`}
              title={isFullScreenApp ? "Exit Full Screen" : "Enter Full Screen"}
            >
              {isFullScreenApp ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
            </motion.button>
            
            <motion.button
              onClick={leaveRoom}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 shadow-lg"
              title="Leave Room"
            >
              <LogOut size={22} />
            </motion.button>
          </div>
        </div>
        
        {/* Fixed position fullscreen indicator with auto-hide after 2 seconds */}
        <AnimatePresence>
          {isFullScreenApp && showEscNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm z-50 flex items-center shadow-xl ${
                darkMode 
                  ? "bg-gradient-to-r from-slate-800 to-indigo-900 text-white border border-indigo-700" 
                  : "bg-gradient-to-r from-white to-blue-100 text-gray-800 border border-blue-200"
              }`}
            >
              <span className="mr-2">Press ESC to exit fullscreen</span>
              <X 
                size={14} 
                onClick={() => setShowEscNotification(false)} 
                className={`cursor-pointer ${darkMode ? "hover:text-cyan-400" : "hover:text-cyan-600"}`} 
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Code Editor Section (Responsive Sizing) */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            showSidebar 
              ? "w-[calc(100%-21rem)]"
              : "w-[calc(100%-4rem)]"
          }`}
          ref={codeEditorRef}
        >
          <CodeEditor className="h-full rounded-none" parentIsFullScreen={isFullScreenApp} />
        </div>
        
        {/* Sidebar (Participants/Messages) with updated color scheme */}
        <AnimatePresence>
          {showSidebar && (
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
                  {sidebarContent === "participants" ? "Participants" : "Chat"}
                </h3>
                <button 
                  onClick={() => setShowSidebar(false)}
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
                {sidebarContent === "participants" ? (
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {participants.length} People
                      </span>
                      <button className={`flex items-center text-sm font-medium ${
                        darkMode ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-700"
                      }`}>
                        <UserPlus size={16} className="mr-1" /> Invite
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {participants.map(participant => (
                        <div 
                          key={participant.id}
                          className={`flex items-center p-2 rounded-lg transition-colors ${
                            darkMode ? "hover:bg-slate-800" : "hover:bg-blue-50"
                          }`}
                        >
                          <div className="relative mr-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                              {participant.name.charAt(0)}
                            </div>
                            {participant.isActive && (
                              <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 ${
                                darkMode ? "border-slate-900" : "border-white"
                              }`}></div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">{participant.name}</p>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {participant.isHost ? "Host" : "Participant"}
                            </p>
                          </div>
                          {participant.isHost && (
                            <div className="text-yellow-500">
                              <Settings size={16} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-grow overflow-y-auto p-4">
                      <div className="space-y-4">
                        {messages.map(message => (
                          <div 
                            key={message.id}
                            className={`p-3 rounded-lg max-w-[85%] shadow-md ${
                              message.isOwn 
                                ? "ml-auto bg-gradient-to-r from-cyan-600 to-teal-600 text-white" 
                                : darkMode ? "bg-slate-800" : "bg-blue-50"
                            }`}
                          >
                            {!message.isOwn && (
                              <p className="text-xs font-semibold mb-1">{message.sender}</p>
                            )}
                            <p>{message.message}</p>
                            <p className={`text-xs mt-1 text-right ${
                              message.isOwn 
                                ? "text-cyan-100" 
                                : darkMode ? "text-gray-400" : "text-gray-500"
                            }`}>{message.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <form 
                      onSubmit={handleSendMessage}
                      className={`p-3 border-t ${
                        darkMode 
                          ? "border-indigo-900 bg-slate-900" 
                          : "border-blue-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className={`flex-grow p-2 rounded-l-lg border focus:outline-none focus:ring-2 ${
                            darkMode 
                              ? "bg-slate-800 border-indigo-900 text-white focus:ring-cyan-600" 
                              : "bg-blue-50 border-blue-200 text-gray-800 focus:ring-cyan-500"
                          }`}
                        />
                        <button 
                          type="submit"
                          className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white p-2 rounded-r-lg transition-colors"
                        >
                          <Share size={20} />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Enhanced Copy Link Popup with updated styling */}
      <AnimatePresence>
        {showCopyPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-10 left-1/2 transform -translate-x-1/2 p-6 rounded-xl shadow-2xl w-96 z-50 ${
              darkMode 
                ? "bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-800" 
                : "bg-gradient-to-r from-white to-blue-50 text-gray-800 border border-blue-200"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className={`text-lg font-semibold ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>
                Share Room Link
              </h3>
              <button 
                onClick={closeCopyPopup}
                className={`p-1 rounded-full transition-colors ${
                  darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={`flex items-center p-3 rounded-lg mb-4 border ${
              darkMode 
                ? "bg-slate-800 bg-opacity-50 border-indigo-900" 
                : "bg-blue-50 bg-opacity-50 border-blue-200"
            }`}>
              <div className="flex-grow truncate mr-2 font-mono text-sm">
                {roomLink}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomLink);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                className={`p-2 rounded-lg transition-colors text-white flex items-center shadow-md ${
                  isCopied 
                    ? "bg-green-500" 
                    : "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500"
                }`}
              >
                {isCopied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            
            <p className={darkMode ? "text-gray-300 text-sm" : "text-gray-600 text-sm"}>
              Share this link with others to invite them to join your collaborative coding session.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomPage;