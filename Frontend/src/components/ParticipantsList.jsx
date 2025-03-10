import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  UserCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useSelector } from 'react-redux';

const ParticipantsList = ({ participants = [] }) => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Mock participants if not provided (remove in actual implementation)
  const mockParticipants = [
    {
      id: '1',
      name: 'John Doe',
      isMicOn: true,
      isCameraOn: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      isMicOn: false,
      isCameraOn: true
    },
    {
      id: '3',
      name: 'Mike Johnson',
      isMicOn: true,
      isCameraOn: false
    }
  ];
  
  const displayParticipants = participants.length > 0 ? participants : mockParticipants;

  return (
    <div className={`rounded-lg shadow-md transition-all ${
      darkMode 
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border border-gray-900 text-white" 
        : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 border border-gray-200 text-gray-800"
    }`}>
      {/* Header Section */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Users size={20} className={`${darkMode ? "text-cyan-400" : "text-cyan-600"}`} />
          <h3 className="font-medium">Participants ({displayParticipants.length})</h3>
        </div>
        {isExpanded ? 
          <ChevronUp size={18} className={`${darkMode ? "text-cyan-400" : "text-cyan-600"}`} /> : 
          <ChevronDown size={18} className={`${darkMode ? "text-cyan-400" : "text-cyan-600"}`} />
        }
      </div>
      
      {/* Participants List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`p-4 pt-0 max-h-64 overflow-y-auto ${
              darkMode ? "divide-gray-800" : "divide-gray-200"
            }`}>
              {displayParticipants.length === 0 ? (
                <div className={`flex items-center justify-center p-6 text-center ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  <p>No participants yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {displayParticipants.map((participant) => (
                    <li 
                      key={participant.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`p-2 rounded-full shadow-md ${
                            darkMode 
                              ? "bg-slate-800" 
                              : "bg-white"
                          }`}
                        >
                          <UserCircle size={20} className={`${darkMode ? "text-cyan-400" : "text-cyan-600"}`} />
                        </motion.div>
                        <span className="font-medium">{participant.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        {participant.isMicOn ? (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`p-1 rounded transition-all ${
                              darkMode 
                                ? "bg-slate-800 text-cyan-400" 
                                : "bg-white text-cyan-600"
                            }`}
                          >
                            <Mic size={16} />
                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`p-1 rounded transition-all ${
                              darkMode 
                                ? "bg-slate-800 text-red-400" 
                                : "bg-white text-red-500"
                            }`}
                          >
                            <MicOff size={16} />
                          </motion.div>
                        )}
                        {participant.isCameraOn ? (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`p-1 rounded transition-all ${
                              darkMode 
                                ? "bg-slate-800 text-cyan-400" 
                                : "bg-white text-cyan-600"
                            }`}
                          >
                            <Video size={16} />
                          </motion.div>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`p-1 rounded transition-all ${
                              darkMode 
                                ? "bg-slate-800 text-red-400" 
                                : "bg-white text-red-500"
                            }`}
                          >
                            <VideoOff size={16} />
                          </motion.div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticipantsList;