import React from 'react';
import { Settings, UserPlus, Mic, MicOff, Video, VideoOff } from "lucide-react";

const ParticipantsList = ({ participants, darkMode }) => {
  return (
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
            key={participant.email}
            className={`flex items-center p-2 rounded-lg transition-colors ${
              darkMode ? "hover:bg-slate-800" : "hover:bg-blue-50"
            }`}
          >
            <div className="relative mr-3">
              {participant.profileImage ? (
                <img 
                  src={`https://codelab-sq6v.onrender.com/${participant.profileImage}`}
                  alt={participant.fullname}
                  className="h-10 w-10 rounded-full object-cover shadow-lg"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {participant.fullname.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <div className="flex items-center">
                <p className="font-medium mr-2">{participant.fullname}</p>
                {participant.isHost && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    darkMode 
                      ? "bg-yellow-600 text-yellow-100" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    Host
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {/* Mic Status */}
                <div className={`text-xs flex items-center ${
                  participant.isMicOn 
                    ? (darkMode ? "text-green-400" : "text-green-600")
                    : (darkMode ? "text-red-400" : "text-red-600")
                }`}>
                  {participant.isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
                  <span className="ml-1">{participant.isMicOn ? "Mic On" : "Mic Off"}</span>
                </div>
                
                {/* Camera Status */}
                <div className={`text-xs flex items-center ${
                  participant.isCameraOn 
                    ? (darkMode ? "text-green-400" : "text-green-600")
                    : (darkMode ? "text-red-400" : "text-red-600")
                }`}>
                  {participant.isCameraOn ? <Video size={14} /> : <VideoOff size={14} />}
                  <span className="ml-1">{participant.isCameraOn ? "Camera On" : "Camera Off"}</span>
                </div>
              </div>
            </div>
            
            {participant.isHost && (
              <div className={`text-yellow-500 ${darkMode ? "opacity-70" : ""}`}>
                <Settings size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;