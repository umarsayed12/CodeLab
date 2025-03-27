

// New Component: ParticipantsList
import {Settings, UserPlus} from "lucide-react";
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
  );
};

export default ParticipantsList