import { motion, AnimatePresence } from "framer-motion";
import {Share} from "lucide-react";
const ChatMessages = ({ messages, newMessage, setNewMessage, handleSendMessage, darkMode }) => {
    return (
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
              <Share size={26} />
            </button>
          </div>
        </form>
      </div>
    );
  };

  export default ChatMessages;