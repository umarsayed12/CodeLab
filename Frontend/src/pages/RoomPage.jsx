// // Main RoomPage Component

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// import {Footer, Header, LoadingScreen, AccessDeniedScreen, ControlBar , EscNotification , ShareLinkPopup , Sidebar , ChatMessages
//   ,CodeEditor
//  } from "../components";

// const RoomPage = () => {
//   const navigate = useNavigate();
//   const codeEditorRef = useRef(null);
//   const isAuthenticated = useSelector((state) => state.auth.isAuth);
//   const isLoading = useSelector((state) => state.auth.isLoading);
//   const darkMode = useSelector((state) => state.theme.darkMode);

//   // Media States
//   const [isCameraOn, setIsCameraOn] = useState(true);
//   const [isMicOn, setIsMicOn] = useState(true);

//   // Room States - Memoize initial data
//   const [participants] = useState([
//     { id: 1, name: "Jane Cooper", avatar: "/avatars/1.png", isHost: true, isActive: true },
//     { id: 2, name: "Wade Warren", avatar: "/avatars/2.png", isHost: false, isActive: true },
//     { id: 3, name: "Esther Howard", avatar: "/avatars/3.png", isHost: false, isActive: false }
//   ]);

//   const [messages, setMessages] = useState([
//     { id: 1, sender: "Jane Cooper", message: "Let's fix that bug in the auth flow", time: "10:23 AM" },
//     { id: 2, sender: "Wade Warren", message: "I think we need to update the API endpoint first", time: "10:25 AM" }
//   ]);

//   // UI States
//   const [roomLink, setRoomLink] = useState("");
//   const [showCopyPopup, setShowCopyPopup] = useState(false);
//   const [isCopied, setIsCopied] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [sidebarContent, setSidebarContent] = useState("participants");
//   const [newMessage, setNewMessage] = useState("");
//   const [isFullScreenApp, setIsFullScreenApp] = useState(false);
//   const [showEscNotification, setShowEscNotification] = useState(false);

//   // Check authentication
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       const timer = setTimeout(() => {
//         navigate("/login", {
//           state: { message: "Please log in to access the room.", redirectFrom: "/room" },
//         });
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   // Handle fullscreen toggle
//   useEffect(() => {
//     const handleEscKey = (e) => {
//       if (e.key === "Escape" && isFullScreenApp) {
//         setIsFullScreenApp(false);
//       }
//     };

//     document.addEventListener("keydown", handleEscKey);

//     if (isFullScreenApp) {
//       document.body.style.overflow = "hidden";
//       // Show ESC notification for 2 seconds
//       setShowEscNotification(true);
//       const timer = setTimeout(() => {
//         setShowEscNotification(false);
//       }, 2000);

//       return () => clearTimeout(timer);
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscKey);
//       document.body.style.overflow = "";
//     };
//   }, [isFullScreenApp]);

//   // Room Control Handlers
//   const toggleCamera = useCallback(() => setIsCameraOn(prev => !prev), []);
//   const toggleMic = useCallback(() => setIsMicOn(prev => !prev), []);
//   const toggleFullScreenApp = useCallback(() => setIsFullScreenApp(prev => !prev), []);

//   // Share Room Link
//   const shareRoomLink = useCallback(() => {
//     const link = `${window.location.origin}/room/${Math.random().toString(36).substring(7)}`;
//     setRoomLink(link);
//     setShowCopyPopup(true);

//     navigator.clipboard.writeText(link).then(() => {
//       setIsCopied(true);
//       setTimeout(() => setIsCopied(false), 2000);
//     });
//   }, []);

//   // Leave Room
//   const leaveRoom = useCallback(() => {
//     if (window.confirm("Are you sure you want to leave this collaborative session?")) {
//       navigate("/");
//     }
//   }, [navigate]);

//   // Toggle Sidebar Content
//   const toggleSidebar = useCallback((content) => {
//     setShowSidebar(prev => {
//       if (prev && sidebarContent === content) {
//         return false;
//       } else {
//         setSidebarContent(content);
//         return true;
//       }
//     });
//   }, [sidebarContent]);

//   // Close Copy Popup
//   const closeCopyPopup = useCallback(() => {
//     setShowCopyPopup(false);
//     setIsCopied(false);
//   }, []);

//   // Handle sending a new message
//   const handleSendMessage = useCallback((e) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       const newMsg = {
//         id: messages.length + 1,
//         sender: "You",
//         message: newMessage,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         isOwn: true
//       };
//       setMessages(prev => [...prev, newMsg]);
//       setNewMessage("");
//     }
//   }, [messages.length, newMessage]);

//   // Enhanced Loading State
//   if (isLoading) {
//     return <LoadingScreen title="Loading" message="Verifying your credentials..." />;
//   }

//   // Access Denied UI if NOT Authenticated
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex flex-col ">
//       <Header/>
//       <main className="w-full h-full flex flex-col flex-grow">
//       <AccessDeniedScreen darkMode={darkMode} navigate={navigate} />
//       </main>
//       <Footer/>
//       </div>
//     )
//   }

//   return (
//     <div
//       className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
//         darkMode
//           ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white"
//           : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
//       }`}
//       style={{
//         position: isFullScreenApp ? 'fixed' : 'relative',
//         top: isFullScreenApp ? 0 : 'auto',
//         left: isFullScreenApp ? 0 : 'auto',
//         right: isFullScreenApp ? 0 : 'auto',
//         bottom: isFullScreenApp ? 0 : 'auto',
//         zIndex: isFullScreenApp ? 9999 : 'auto',
//         height: isFullScreenApp ? '100vh' : '100vh',
//         width: isFullScreenApp ? '100vw' : '100%',
//       }}
//     >
//       {!isFullScreenApp && <Header />}

//       {/* Main Room Container */}
//       <div className="flex flex-grow overflow-hidden relative">
//         {/* Left Sidebar (Control Bar) */}
//         <ControlBar
//           isCameraOn={isCameraOn}
//           toggleCamera={toggleCamera}
//           isMicOn={isMicOn}
//           toggleMic={toggleMic}
//           sidebarContent={sidebarContent}
//           toggleSidebar={toggleSidebar}
//           showSidebar={showSidebar}
//           shareRoomLink={shareRoomLink}
//           isFullScreenApp={isFullScreenApp}
//           toggleFullScreenApp={toggleFullScreenApp}
//           leaveRoom={leaveRoom}
//           darkMode={darkMode}
//         />

//         {/* Fullscreen indicator */}
//         <AnimatePresence>
//           <EscNotification
//             show={isFullScreenApp && showEscNotification}
//             darkMode={darkMode}
//             onClose={() => setShowEscNotification(false)}
//           />
//         </AnimatePresence>

//         {/* Code Editor Section */}
//         <div
//           className={`transition-all duration-300 ease-in-out ${
//             showSidebar
//               ? "w-[calc(100%-21rem)]"
//               : "w-[calc(100%-4rem)]"
//           }`}
//           ref={codeEditorRef}
//         >
//           <CodeEditor className="h-full rounded-none" parentIsFullScreen={isFullScreenApp} />
//         </div>

//         {/* Sidebar (Participants/Messages) */}
//         <AnimatePresence>
//           <Sidebar
//             show={showSidebar}
//             content={sidebarContent}
//             onClose={() => setShowSidebar(false)}
//             participants={participants}
//             messages={messages}
//             newMessage={newMessage}
//             setNewMessage={setNewMessage}
//             handleSendMessage={handleSendMessage}
//             darkMode={darkMode}
//           />
//         </AnimatePresence>
//       </div>

//       {/* Copy Link Popup */}
//       <AnimatePresence>
//         <ShareLinkPopup
//           show={showCopyPopup}
//           roomLink={roomLink}
//           isCopied={isCopied}
//           setIsCopied={setIsCopied}
//           onClose={closeCopyPopup}
//           darkMode={darkMode}
//         />
//       </AnimatePresence>
//     </div>
//   );
// };

// export default RoomPage;

import axios from "axios";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toast";
import { setLoading } from "../redux/authSlice";

import {
  Footer,
  LeaveRoomModal,
  Header,
  LoadingScreen,
  AccessDeniedScreen,
  ControlBar,
  EscNotification,
  ShareLinkPopup,
  Sidebar,
  ChatMessages,
  CodeEditor,
} from "../components";

const RoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { roomId } = useParams(); // Get roomId from URL params
  const codeEditorRef = useRef(null);
  const socketRef = useRef(null);
  const userData = useSelector((state) => state.auth.userData); // Using userData as in authSlice
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [participants, setParticipants] = useState([]);
  const [code, setCode] = useState(`// Write your code here...`);
  const [language, setLanguage] = useState("javascript");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [roomLink, setRoomLink] = useState("");
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarContent, setSidebarContent] = useState("participants");
  const [isFullScreenApp, setIsFullScreenApp] = useState(false);
  const [showEscNotification, setShowEscNotification] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const [host , setHost] = useState({});
  // Authentication check and redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      AccessDeniedScreenComponent(
        darkMode,
        navigate,
        "/login",
        4,
        "Access Denied",
        "Please log in to access the room.",
        "Redirecting in",
        { redirectFrom: "/room/roomId" }
      );
      const timer = setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Please log in to access the room.",
            redirectFrom: "/room",
          },
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show notification with auto-dismiss
  const showNotification = useCallback((message, type = "info") => {
    setNotification({
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && userData && roomId) {
      //validtion check for roomId and user
      dispatch(setLoading(true));
      const url = `http://localhost:5000/room/${roomId}`;
      axios
        .get(url, {
          params: { user: userData }, // Send userId for backend validation
          withCredentials: true,
        })
        .then((response) => {
          dispatch(setLoading(false));
          if (response.data.status === "error") {
            console.log("Frontend error ");
            navigate("/join", {
              state: {
                message: response.data.message,
              },
            });

          } else if (response.data.status === "warning") {
            console.log("Frontend warning ");
            navigate("/join", {
              state: {
                message: response.data.message,
              },
            });
          } else if (response.data.status === "success") {
            showSuccessToast(response.data.message); //show like welcome to the meeting

              setHost(response.data.host); // set actual host in this state
              setIsHost(response.data.host._id === userData._id); // set the current user state that he is host or not 

            const socketOptions = {
              path: "/socket.io",
              autoConnect: true,
              withCredentials: true,
              transports: ["websocket", "polling"],
              reconnection: true,
              reconnectionAttempts: 5,
              reconnectionDelay: 3000,
              forceNew: false,
              timeout: 10000,
              secure: process.env.NODE_ENV === "production",
              rejectUnauthorized: false
            };
    
            socketRef.current = io("http://localhost:5000", socketOptions);
           

            // Handle connection errors
            socketRef.current.on("connect_error", (err) => {
              console.error("Socket connection error:", err.message);
              showErrorToast("Failed to connect to the server. Please try again.");
              navigate("/join" , {
                state: {
                  message: "Failed to connect to the server. Please try again.",
                },}  
              );
            });
            // Join room when socket is connected
            socketRef.current.on("connect", () => {
              console.log("Socket connection Frontend", socketRef.current?.id);
              socketRef.current.emit("join-room", {
                roomId,
                user: userData,
              });
            });

            socketRef.current.on("user-joined", (data) => {
              setParticipants(data.roomUsers);

              // Check if current user is host directly from user data
              
              // Show notification for user joining
              if (data.user ) {
                showNotification(
                  `${data.user?.fullname || 'unknown'} joined the room`,
                  "success"
                );
              }
            });

            // Socket event listeners
            socketRef.current.on("code-update", (newCode) => {
              setCode(newCode);
            });

            socketRef.current.on("language-update", (newLanguage) => {
              setLanguage(newLanguage);
            });
            //messagedata is an array of objects
            socketRef.current.on("new-message", (messageData) => {
              setMessages(messageData);
            });

          

            socketRef.current.on("user-left", (data) => {
              setParticipants(data.roomUsers);

              // Show notification for user leaving
              if (data.user && data.user._id !== userData._id) {
                showNotification(`${data.user.fullname} left the room`, "info");
              }
            });

            socketRef.current.on("user-typing", (username) => {
              setTypingUser(username);
              setIsTyping(true);

              // Clear previous timeout
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }

              // Set new timeout
              typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
              }, 3000);
            });

            socketRef.current.on("room-closed", () => {
              // Show notification first

              showNotification(
                "The host left the room. The session is ending.",
                "error"
              );
              // socketRef.current.disconnect();// this is done when we redirect to homepage auto via unmount state using return

              // Redirect after a delay to allow seeing the notification
              setTimeout(() => {
                navigate("/");
              }, 3000);
            });

            socketRef.current.on("user-blocked", (user) => {
              if (user._id === userData._id) {
                showNotification(
                  "You have been blocked from this room.",
                  "error"
                );
                //i think here should be pointed the alert function
                // Redirect after a delay to allow seeing the notification
                // socketRef.current.disconnect();// this is done when we redirect to homepage auto via unmount state using return
                setTimeout(() => {
                  navigate("/");
                }, 3000);
              } else {
                showNotification(
                  `User ${user.fullname} has been blocked from this room.`,
                  "error"
                );
              }
            });

          }
           // Create room link
           setRoomLink(`${window.location.origin}/room/${roomId}`);
        })
        .catch((err) => {
          console.log("Frontend catch error ");
          err.response?.data?.message || "Something went wrong!"
          dispatch(setLoading(false));
          navigate("/join", {
            state: {
              message:  err.response?.data?.message || "Something went wrong!"
            },
          });
        });

      // Clean up function when unmounts from this website
      return () => {
        if (socketRef?.current) {
          socketRef.current.emit("leave-room");
          // socketRef.current.off("code-update");
          // socketRef.current.off("language-update");
          // socketRef.current.off("new-message");
          // socketRef.current.off("user-joined");
          // socketRef.current.off("user-left");
          // socketRef.current.off("user-typing");
          // socketRef.current.off("room-closed");
          // socketRef.current.off("user-blocked");
          socketRef.current.disconnect();
        }
        if (typingTimeoutRef?.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
  }, [
    isAuthenticated, 
    userData, 
    roomId, 
    navigate, 
    showNotification,
    dispatch,
  ]);

  // Handle full screen ESC notification
  useEffect(() => {
    if (isFullScreenApp) {
      setShowEscNotification(true);
      const timer = setTimeout(() => {
        setShowEscNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFullScreenApp]);

  // Handle code changes
  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode);
      socketRef.current?.emit("code-change", { roomId, code: newCode });
    },
    [roomId]
  );

  // Handle language changes
  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage);
      socketRef.current?.emit("language-change", {
        roomId,
        language: newLanguage,
      });
    },
    [roomId]
  );

  // Handle message typing
  const handleMessageTyping = useCallback(() => {
    socketRef.current?.emit("typing", { roomId });
  }, [roomId]);

  // Handle sending messages
  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      if (newMessage.trim()) {
        const messageData = {
          message: newMessage,
          sender: userData,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, messageData]);
        socketRef.current?.emit("update-messages", { roomId, messageData });
      }
    },
    [newMessage, roomId, userData]
  );

  // UI control functions
  const toggleCamera = useCallback(() => setIsCameraOn((prev) => !prev), []);
  const toggleMic = useCallback(() => setIsMicOn((prev) => !prev), []);
  const toggleFullScreenApp = useCallback(
    () => setIsFullScreenApp((prev) => !prev),
    []
  );

  const shareRoomLink = useCallback(() => {
    setShowCopyPopup(true);

    navigator.clipboard.writeText(roomLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [roomLink]);

  const leaveRoom = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to leave this collaborative session?"
      )
    ) {
      socketRef.current?.emit("leave-room");
      navigate("/");
    }
  }, [navigate]);

  const toggleSidebar = useCallback(
    (content) => {
      setShowSidebar((prev) => {
        if (prev && sidebarContent === content) {
          return false;
        } else {
          setSidebarContent(content);
          return true;
        }
      });
    },
    [sidebarContent]
  );

  const closeCopyPopup = useCallback(() => {
    setShowCopyPopup(false);
    setIsCopied(false);
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <LoadingScreen title="Loading" message="Verifying your credentials..." />
    );
  }

  // Access denied screen
  if (!isAuthenticated) {
    return (
      // <div className="min-h-screen flex flex-col">
      //   <Header />
      //   <main className="w-full h-full flex flex-col flex-grow">
      //     <AccessDeniedScreen darkMode={darkMode} navigate={navigate} />
      //   </main>
      //   <Footer />
      // </div>
      <AccessDeniedScreenComponent darkMode={darkMode} navigate={navigate} />
    );
  }

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white"
          : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
      }`}
      style={{
        position: isFullScreenApp ? "fixed" : "relative",
        top: isFullScreenApp ? 0 : "auto",
        left: isFullScreenApp ? 0 : "auto",
        right: isFullScreenApp ? 0 : "auto",
        bottom: isFullScreenApp ? 0 : "auto",
        zIndex: isFullScreenApp ? 9999 : "auto",
        height: isFullScreenApp ? "100vh" : "100vh",
        width: isFullScreenApp ? "100vw" : "100%",
      }}
    >
      {!isFullScreenApp && <Header />}

      <div className="flex flex-grow overflow-hidden relative">
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
          isHost={isHost}
        />

        <AnimatePresence>
          {showEscNotification && (
            <EscNotification
              show={isFullScreenApp}
              darkMode={darkMode}
              onClose={() => setShowEscNotification(false)}
            />
          )}
        </AnimatePresence>

        {/* User notification system */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${
                notification.type === "success"
                  ? "bg-green-600 text-white"
                  : notification.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              <div className="flex items-center">
                <span className="font-medium mr-2">
                  {notification.timestamp}
                </span>
                <span>{notification.message}</span>
                <button
                  onClick={() => setNotification(null)}
                  className="ml-4 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`transition-all duration-300 ease-in-out ${
            showSidebar ? "w-[calc(100%-21rem)]" : "w-[calc(100%-4rem)]"
          }`}
          ref={codeEditorRef}
        >
          <CodeEditor
            className="h-full rounded-none"
            parentIsFullScreen={isFullScreenApp}
            code={code}
            language={language}
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        <AnimatePresence>
          {showSidebar && (
            <Sidebar
              show={true}
              content={sidebarContent}
              onClose={() => setShowSidebar(false)}
              participants={participants}
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              handleMessageTyping={handleMessageTyping}
              isTyping={isTyping}
              typingUser={typingUser}
              darkMode={darkMode}
              currentUser={userData}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showCopyPopup && (
          <ShareLinkPopup
            show={true}
            roomLink={roomLink}
            isCopied={isCopied}
            setIsCopied={setIsCopied}
            onClose={closeCopyPopup}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomPage;

const AccessDeniedScreenComponent = (
  darkMode,
  navigate,
  redirectPath,
  redirectTimer,
  title,
  message,
  redirectMessage,
  redirectState = {}
) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="w-full h-full flex flex-col flex-grow">
        <AccessDeniedScreen
          darkMode={darkMode}
          navigate={navigate}
          title={title}
          redirectPath={redirectPath}
          redirectMessage={redirectMessage}
          redirectTimer={redirectTimer}
          redirectState={redirectState}
          message={message}
        />
      </main>
      <Footer />
    </div>
  );
};
