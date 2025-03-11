// Main RoomPage Component
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {CodeEditor, Footer, Header, ParticipantsList, ProfilePanel, LoadingScreen, AccessDeniedScreen , 
  ChatMessages , ControlBar , ControlBarButton, EscNotification , Sidebar , ShareLinkPopup } from "../components";

const RoomPage = () => {
  const navigate = useNavigate();
  const codeEditorRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const darkMode = useSelector((state) => state.theme.darkMode);
  
  // Media States
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  
  // Room States - Memoize initial data
  const [participants] = useState([
    { id: 1, name: "Jane Cooper", avatar: "/avatars/1.png", isHost: true, isActive: true },
    { id: 2, name: "Wade Warren", avatar: "/avatars/2.png", isHost: false, isActive: true },
    { id: 3, name: "Esther Howard", avatar: "/avatars/3.png", isHost: false, isActive: false }
  ]);
  
  const [messages, setMessages] = useState([
    { id: 1, sender: "Jane Cooper", message: "Let's fix that bug in the auth flow", time: "10:23 AM" },
    { id: 2, sender: "Wade Warren", message: "I think we need to update the API endpoint first", time: "10:25 AM" }
  ]);
  
  // UI States
  const [roomLink, setRoomLink] = useState("");
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarContent, setSidebarContent] = useState("participants");
  const [newMessage, setNewMessage] = useState("");
  const [isFullScreenApp, setIsFullScreenApp] = useState(false);
  const [showEscNotification, setShowEscNotification] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/login", {
          state: { message: "Please log in to access the room.", redirectFrom: "/room" },
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Handle fullscreen toggle
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

  // Room Control Handlers
  const toggleCamera = useCallback(() => setIsCameraOn(prev => !prev), []);
  const toggleMic = useCallback(() => setIsMicOn(prev => !prev), []);
  const toggleFullScreenApp = useCallback(() => setIsFullScreenApp(prev => !prev), []);

  // Share Room Link
  const shareRoomLink = useCallback(() => {
    const link = `${window.location.origin}/room/${Math.random().toString(36).substring(7)}`;
    setRoomLink(link);
    setShowCopyPopup(true);
    
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, []);

  // Leave Room
  const leaveRoom = useCallback(() => {
    if (window.confirm("Are you sure you want to leave this collaborative session?")) {
      navigate("/");
    }
  }, [navigate]);

  // Toggle Sidebar Content
  const toggleSidebar = useCallback((content) => {
    setShowSidebar(prev => {
      if (prev && sidebarContent === content) {
        return false;
      } else {
        setSidebarContent(content);
        return true;
      }
    });
  }, [sidebarContent]);

  // Close Copy Popup
  const closeCopyPopup = useCallback(() => {
    setShowCopyPopup(false);
    setIsCopied(false);
  }, []);

  // Handle sending a new message
  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
    }
  }, [messages.length, newMessage]);

  // Enhanced Loading State
  if (isLoading) {
    return <LoadingScreen title="Loading" message="Verifying your credentials..." />;
  }

  // Access Denied UI if NOT Authenticated
  if (!isAuthenticated) {
    return <AccessDeniedScreen darkMode={darkMode} navigate={navigate} />;
  }

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
      {!isFullScreenApp && <Header />}
      
      {/* Main Room Container */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Left Sidebar (Control Bar) */}
        <ControlBar 
          isCameraOn={isCameraOn}
          toggleCamera={toggleCamera}
          isMicOn={isMicOn}
          toggleMic={toggleMic}
          sidebarContent={sidebarContent}
          toggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
          shareRoomLink={shareRoomLink}
          isFullScreenApp={isFullScreenApp}
          toggleFullScreenApp={toggleFullScreenApp}
          leaveRoom={leaveRoom}
          darkMode={darkMode}
        />
        
        {/* Fullscreen indicator */}
        <AnimatePresence>
          <EscNotification 
            show={isFullScreenApp && showEscNotification} 
            darkMode={darkMode} 
            onClose={() => setShowEscNotification(false)} 
          />
        </AnimatePresence>
        
        {/* Code Editor Section */}
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
        
        {/* Sidebar (Participants/Messages) */}
        <AnimatePresence>
          <Sidebar
            show={showSidebar}
            content={sidebarContent}
            onClose={() => setShowSidebar(false)}
            participants={participants}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            darkMode={darkMode}
          />
        </AnimatePresence>
      </div>
      
      {/* Copy Link Popup */}
      <AnimatePresence>
        <ShareLinkPopup
          show={showCopyPopup}
          roomLink={roomLink}
          isCopied={isCopied}
          setIsCopied={setIsCopied}
          onClose={closeCopyPopup}
          darkMode={darkMode}
        />
      </AnimatePresence>
    </div>
  );
};

export default RoomPage;