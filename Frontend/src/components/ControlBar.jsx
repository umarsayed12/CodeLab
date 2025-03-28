// New Component: ControlBar
import {
  Video, VideoOff, Mic, MicOff, Users, MessageCircle,  LogOut,
   Bot,  Clipboard,  ChevronLeft, ChevronRight
} from "lucide-react";
import ControlBarButton from "./ControlBarButton";
const ControlBar = ({ 
    isCameraOn, toggleCamera, 
    isMicOn, toggleMic, 
    sidebarContent, toggleSidebar, 
    showSidebar, shareRoomLink, 
    isFullScreenApp, toggleFullScreenApp, 
    leaveRoom, darkMode 
  }) => {
    return (
      <div className={`w-16 flex flex-col items-center py-6 space-y-6 shadow-lg z-10 px-2 ${
        darkMode 
          ? "bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900" 
          : "bg-gradient-to-b from-blue-50 to-indigo-100 "
      }`}>
        <div className="space-y-6">
          <ControlBarButton
            onClick={toggleCamera}
            active={true}
            activeColor={isCameraOn 
              ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            }
            darkMode={darkMode}
            title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isCameraOn ? <Video size={22} /> : <VideoOff size={22} />}
          </ControlBarButton>
          
          <ControlBarButton
            onClick={toggleMic}
            active={true}
            activeColor={isMicOn 
              ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            }
            darkMode={darkMode}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
          </ControlBarButton>
        </div>
        
        <div className="space-y-6">
          <ControlBarButton
            onClick={() => toggleSidebar("participants")}
            active={showSidebar && sidebarContent === "participants"}
            activeColor="bg-gradient-to-r from-sky-600 to-cyan-600 text-white"
            darkMode={darkMode}
            title="Show Participants"
          >
            <Users size={22} />
          </ControlBarButton>
          
          <ControlBarButton
            onClick={() => toggleSidebar("messages")}
            active={showSidebar && sidebarContent === "messages"}
            activeColor="bg-gradient-to-r from-sky-600 to-cyan-600 text-white"
            darkMode={darkMode}
            title="Show Messages"
          >
            <MessageCircle size={22} />
          </ControlBarButton>
          
          <ControlBarButton
            onClick={() => {}}
            active={false}
            inactiveColor={{
              dark: "bg-slate-800 hover:bg-slate-700 text-purple-300",
              light: "bg-white hover:bg-blue-100 text-purple-600"
            }}
            darkMode={darkMode}
            title="AI Assistant"
          >
            <Bot size={22} />
          </ControlBarButton>
        </div>
        
        <div className="space-y-6">
          <ControlBarButton
            onClick={shareRoomLink}
            active={false}
            darkMode={darkMode}
            title="Share Room Link"
          >
            <Clipboard size={22} />
          </ControlBarButton>
          
          <ControlBarButton
            onClick={toggleFullScreenApp}
            active={false}
            darkMode={darkMode}
            title={isFullScreenApp ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullScreenApp ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </ControlBarButton>
          
          <ControlBarButton
            onClick={leaveRoom}
            active={true}
            activeColor="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            darkMode={darkMode}
            title="Leave Room"
          >
            <LogOut size={22} />
          </ControlBarButton>
        </div>
      </div>
    );
  };

  export default ControlBar;