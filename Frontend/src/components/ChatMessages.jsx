import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Share } from "lucide-react";
import { useSelector } from "react-redux";

const ChatMessages = ({ socket, messages, setMessages, darkMode, roomId }) => {
  const [newMessage, setNewMessage] = useState('');
  const userData = useSelector((state) => state.auth.userData);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const messageData = {
      id: Date.now(), // Unique identifier
      message: trimmedMessage,
      sender: userData, // Assuming you want to show sender details
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add message to local state
    setMessages((prevMessages) => [...prevMessages, messageData]);
    
    // Emit message to socket
    socket?.emit("update-messages", { roomId, messageData });
    
    // Clear input after sending
    setNewMessage('');
  };

  const renderProfileImage = (sender, isCurrentUser) => {
    const containerClasses = `${isCurrentUser ? 'ml-2' : 'mr-2'} flex-shrink-0`;
    const imageClasses = "h-10 w-10 rounded-full object-cover shadow-lg";
    const initialClasses = "h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg";

    if (sender.profileImage) {
      return (
        <div className={containerClasses}>
          <img 
            src={`https://codelab-sq6v.onrender.com${sender.profileImage}`}
            alt={sender.fullname}
            className={imageClasses}
          />
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <div className={initialClasses}>
          {sender.fullname.charAt(0)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`flex items-center ${
                  message.sender._id === userData._id 
                    ? 'justify-end' 
                    : 'justify-start'
                }`}
              >
                {message.sender._id !== userData._id && 
                  renderProfileImage(message.sender, false)
                }
                <div 
                  className={`p-3 rounded-lg max-w-[85%] shadow-md ${
                    message.sender._id === userData._id 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                      : darkMode 
                        ? "bg-slate-700 text-gray-200" 
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.sender._id !== userData._id && (
                    <p className="text-xs font-semibold mb-1">
                      {message.sender.fullname}
                    </p>
                  )}
                  <p>{message.message}</p>
                  <p className={`text-xs mt-1 text-right ${
                    message.sender._id === userData._id 
                      ? "text-blue-100" 
                      : darkMode 
                        ? "text-gray-400" 
                        : "text-gray-500"
                  }`}>
                    {message.time}
                  </p>
                </div>
                {message.sender._id === userData._id && 
                  renderProfileImage(message.sender, true)
                }
              </motion.div>
            ))}
          </AnimatePresence>
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
            <Share size={26} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatMessages;