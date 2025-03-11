import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Video, VideoOff, Mic, MicOff, RefreshCw, AlertTriangle } from "lucide-react";
import { Header, Footer, LoadingScreen, AccessDeniedScreen } from "../components";

const SetupPage = () => {
  const navigate = useNavigate();
  const roomid = 123;
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const isLoading = useSelector((state) => state.auth.isLoading);
  
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState({ video: [], audio: [] });
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedMicrophone, setSelectedMicrophone] = useState(null);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedCameraId, setSavedCameraId] = useState(null);
  const [savedMicrophoneId, setSavedMicrophoneId] = useState(null);

  // Enhanced fetchDevices with better permission handling
  const fetchDevices = async () => {
    try {
      // Request permissions first if needed (this will trigger browser dialog)
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        tempStream.getTracks().forEach(track => track.stop());
      } catch (permError) {
        console.warn("Permission check encountered an issue:", permError);
        // Continue anyway as we might still be able to enumerate devices
        // even with partial permissions
      }
      
      // Now enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      setDevices({ video: videoDevices, audio: audioDevices });
      
      // If we have no devices or all devices have empty labels (indicating no permissions)
      // we should inform the user
      if ((videoDevices.length === 0 && audioDevices.length === 0) || 
          (devices.length > 0 && devices.every(d => !d.label))) {
        setError("⚠ No devices detected or permission denied. Please check your system settings.");
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      setError("⚠ Unable to access device information. Please check permissions.");
    }
  };

  // Improved startStream function with better handling of device state
  const startStream = async (cameraId = null, micId = null, forceCameraOn = true, forceMicOn = true) => {
    try {
      // Stop existing tracks first to release hardware
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      
      // Save selected device IDs
      if (cameraId) {
        setSavedCameraId(cameraId);
        setSelectedCamera(cameraId);
      }
      
      if (micId) {
        setSavedMicrophoneId(micId);
        setSelectedMicrophone(micId);
      }
      
      // Set up constraints based on current state and selected devices
      const useVideoConstraint = forceCameraOn ? 
        (cameraId ? { deviceId: { exact: cameraId } } : true) : 
        false;
      
      const useAudioConstraint = forceMicOn ? 
        (micId ? { deviceId: { exact: micId } } : true) : 
        false;
      
      const constraints = {
        video: useVideoConstraint,
        audio: useAudioConstraint
      };
      
      // Only attempt to get media if at least one device is requested
      if (constraints.video === false && constraints.audio === false) {
        // Both devices are off, just update state and return
        setIsCameraOn(false);
        setIsMicOn(false);
        setStream(null);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
        return;
      }
      
      // Get the new media stream
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Apply current state to the new stream
      newStream.getVideoTracks().forEach(track => {
        track.enabled = forceCameraOn;
      });
      
      newStream.getAudioTracks().forEach(track => {
        track.enabled = forceMicOn;
      });
      
      // Update state with the new stream
      setStream(newStream);
      
      // Update the video element if it exists and camera is enabled
      if (videoRef.current && (forceCameraOn || constraints.video !== false)) {
        videoRef.current.srcObject = newStream;
      } else if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      // Clear any previous errors
      setError("");
      
      // Update device states based on what was requested
      setIsCameraOn(newStream.getVideoTracks().length > 0 && forceCameraOn);
      setIsMicOn(newStream.getAudioTracks().length > 0 && forceMicOn);
    } catch (error) {
      console.error("Error starting stream:", error);
      
      // Provide detailed error messages for better user experience
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setError("⚠ Permission denied. Please allow camera/microphone access in your browser settings.");
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        setError("⚠ No camera or microphone found. Please connect a device and try again.");
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        setError("⚠ Device is already in use by another application. Please close other video applications.");
      } else if (error.name === "OverconstrainedError") {
        setError("⚠ The selected device is no longer available. Please select another device.");
        // Reset the problematic device selection
        if (forceCameraOn) setSavedCameraId(null);
        if (forceMicOn) setSavedMicrophoneId(null);
      } else {
        setError(`⚠ Unable to access camera or microphone: ${error.message || error.name || "Unknown error"}`);
      }
      
      // Update states to reflect failure
      if (forceCameraOn) setIsCameraOn(false);
      if (forceMicOn) setIsMicOn(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Show error message before redirecting
      const redirectTimeout = setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "Please log in to access the setup page.", 
            redirectFrom: "/setup" 
          } 
        });
      }, 3000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Initial setup
  useEffect(() => {
    // Only initialize media if authenticated and not loading
    if (isAuthenticated && !isLoading) {
      fetchDevices();
      startStream();
    }
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isAuthenticated, isLoading]);

  // Completely rewritten toggleCamera for better reliability
  const toggleCamera = async () => {
    try {
      if (isCameraOn) {
        // Turning camera OFF
        if (stream) {
          // First disable any existing video tracks
          stream.getVideoTracks().forEach(track => {
            track.enabled = false;
            track.stop(); // Actually stop the camera (turns off the indicator light)
          });
        }
        
        // If microphone is still on, we need to maintain audio stream
        if (isMicOn) {
          // Create audio-only stream to maintain microphone
          try {
            const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ 
              audio: selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true,
              video: false 
            });
            
            setStream(audioOnlyStream);
            
            // Remove video from display
            if (videoRef.current) {
              videoRef.current.srcObject = null;
            }
          } catch (audioError) {
            console.error("Error creating audio-only stream:", audioError);
            setError("⚠ Could not maintain audio stream when turning off camera.");
          }
        } else {
          // Both camera and mic are off, just clear everything
          setStream(null);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
        
        // Update state
        setIsCameraOn(false);
      } else {
        // Turning camera ON
        // First, decide what kind of stream we need
        const needMic = isMicOn || (stream && stream.getAudioTracks().length > 0);
        
        // Stop any existing stream to prevent conflicts
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Get camera stream (with mic if needed)
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
          audio: needMic ? (selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true) : false
        });
        
        // Make sure mic maintains its previous state
        if (needMic && !isMicOn) {
          newStream.getAudioTracks().forEach(track => {
            track.enabled = false;
          });
        }
        
        // Update the video display
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        
        // Update state
        setStream(newStream);
        setIsCameraOn(true);
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error toggling camera:", error);
      
      // Provide user-friendly error message
      if (error.name === "NotAllowedError") {
        setError("⚠ Camera access denied. Please check your browser permissions.");
      } else if (error.name === "NotFoundError") {
        setError("⚠ Camera not found. Please connect a camera and try again.");
      } else if (error.name === "NotReadableError") {
        setError("⚠ Camera is already in use by another application.");
      } else {
        setError(`⚠ Camera error: ${error.message || error.name || "Unknown error"}`);
      }
      
      // Ensure state is consistent
      setIsCameraOn(false);
    }
  };

  // Improved toggleMic with more reliable behavior
  const toggleMic = async () => {
    try {
      if (isMicOn) {
        // Turning mic OFF
        if (stream) {
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) {
            // Just disable the tracks, don't stop them to allow quick re-enabling
            audioTracks.forEach(track => {
              track.enabled = false;
            });
          }
        }
        
        // Update state
        setIsMicOn(false);
      } else {
        // Turning mic ON
        if (stream && stream.getAudioTracks().length > 0) {
          // We already have audio tracks, just enable them
          stream.getAudioTracks().forEach(track => {
            track.enabled = true;
          });
          
          setIsMicOn(true);
        } else {
          // We need to create a new stream with audio
          // Determine if we should keep video
          const needVideo = isCameraOn || (stream && stream.getVideoTracks().length > 0);
          
          // Stop existing stream to prevent conflicts
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          
          // Create new stream with appropriate devices
          const newStream = await navigator.mediaDevices.getUserMedia({
            audio: selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : true,
            video: needVideo ? (selectedCamera ? { deviceId: { exact: selectedCamera } } : true) : false
          });
          
          // Update video element if needed
          if (videoRef.current && needVideo) {
            videoRef.current.srcObject = newStream;
          }
          
          // Update state
          setStream(newStream);
          setIsMicOn(true);
          setError(""); // Clear any previous errors
        }
      }
    } catch (error) {
      console.error("Error toggling microphone:", error);
      
      // Provide user-friendly error message
      if (error.name === "NotAllowedError") {
        setError("⚠ Microphone access denied. Please check your browser permissions.");
      } else if (error.name === "NotFoundError") {
        setError("⚠ Microphone not found. Please connect a microphone and try again.");
      } else if (error.name === "NotReadableError") {
        setError("⚠ Microphone is already in use by another application.");
      } else {
        setError(`⚠ Microphone error: ${error.message || error.name || "Unknown error"}`);
      }
      
      // Ensure state is consistent
      setIsMicOn(false);
    }
  };

  // Improved retry stream with proper permission handling
  const retryStream = async () => {
    setIsRefreshing(true);
    setError(""); // Clear previous errors immediately
    
    try {
      // First, stop any existing streams
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      
      // Re-request permissions by creating a temporary stream
      // This will trigger browser permission dialogs if needed
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
        
        // Stop the temporary stream immediately
        tempStream.getTracks().forEach(track => track.stop());
      } catch (permError) {
        // This indicates permission was denied or devices are unavailable
        // Continue to device enumeration anyway as audio might be available if video isn't
        console.warn("Permission check encountered an issue:", permError);
      }
      
      // Now re-fetch the devices after permissions may have changed
      await fetchDevices();
      
      // Restart the stream with current settings or defaults
      await startStream(
        selectedCamera || savedCameraId, 
        selectedMicrophone || savedMicrophoneId, 
        isCameraOn, 
        isMicOn
      );
    } catch (err) {
      console.error("Refresh devices error:", err);
      
      // More specific error messages based on error type
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("⚠ Permission denied. Please allow camera/microphone access in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setError("⚠ No camera or microphone found. Please connect a device and try again.");
      } else {
        setError(`⚠ Failed to refresh devices: ${err.message || "Unknown error"}`);
      }
    } finally {
      // Stop the refresh animation after a delay
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // Enhanced Loading State
  if (isLoading) {
    return <LoadingScreen 
      title="Loading" 
      message="Verifying your credentials..." 
    />;
  }

  // Prevent accessing setup if not authenticated
  if (!isAuthenticated) {
    return <AccessDeniedScreen darkMode={darkMode} navigate={navigate} />;
  }

  return (
    <div className={`flex-grow flex flex-col transition-all ${
      darkMode 
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
        : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
    }`}>
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <motion.div 
          className={`w-full max-w-3xl p-6 rounded-lg shadow-xl transition-all duration-300 ${
            darkMode
              ? "border-2 border-cyan-600 bg-gradient-to-b from-slate-800 to-slate-900"
              : "border-2 border-teal-400 bg-gradient-to-b from-white to-cyan-50"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ 
            boxShadow: darkMode 
              ? "0 0 20px rgba(8, 145, 178, 0.5)" 
              : "0 0 20px rgba(20, 184, 166, 0.3)" 
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`text-2xl font-bold text-center mb-4 ${
              darkMode ? "text-cyan-400" : "text-cyan-600"
            }`}
          >
            Setup Your Video & Audio
          </motion.p>

          {/* Error Message Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center justify-center p-3 mb-4 rounded-lg ${
                  darkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
                }`}
              >
                <AlertTriangle className="mr-2" size={18} />
                <span>{error}</span>
                <motion.button
                  onClick={retryStream}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="ml-4 p-1 rounded-full"
                >
                  <RefreshCw size={18} className={`${isRefreshing ? "animate-spin" : ""}`} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video Preview */}
            <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${
              darkMode ? "bg-slate-700" : "bg-blue-50/80"
            } border-2 ${isCameraOn ? "border-green-500" : "border-red-500"} transition-colors duration-300`}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className={`w-full h-full object-cover ${!isCameraOn ? "invisible" : ""}`}
              />
              
              {!isCameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <VideoOff size={40} className="text-red-500 mb-2" />
                  <p className={`text-center font-medium ${
                    darkMode ? "text-red-400" : "text-red-600"
                  }`}>
                    Camera is turned off
                  </p>
                </div>
              )}

              {/* Status indicator with tooltips */}
              <div className={`absolute bottom-2 right-2 flex items-center space-x-2 p-2 rounded-lg ${
                darkMode ? "bg-slate-800/70" : "bg-white/70"
              }`}>
                <div className="group relative">
                  <div className={`w-3 h-3 rounded-full ${isCameraOn ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs rounded bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Camera: {isCameraOn ? "On" : "Off"}
                  </div>
                </div>
                <div className="group relative">
                  <div className={`w-3 h-3 rounded-full ${isMicOn ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs rounded bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Microphone: {isMicOn ? "On" : "Off"}
                  </div>
                </div>
              </div>
            </div>

            {/* Device Selection */}
            <div className="space-y-4">
              {/* Camera Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Select Camera
                </label>
                <select 
                  value={selectedCamera || ''}
                  onChange={(e) => {
                    const newCameraId = e.target.value;
                    setSelectedCamera(newCameraId);
                    setSavedCameraId(newCameraId);
                    
                    // Only start stream if camera is currently on
                    if (isCameraOn) {
                      startStream(newCameraId, null, true, false);
                    }
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    darkMode 
                      ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500" 
                      : "bg-blue-50/80 border-gray-300 text-gray-800 focus:border-teal-500"
                  } focus:outline-none transition-colors`}
                  disabled={isRefreshing}
                >
                  <option value="">Default Camera</option>
                  {devices.video?.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.substring(0, 8)}...`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Microphone Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Select Microphone
                </label>
                <select 
                  value={selectedMicrophone || ''}
                  onChange={(e) => {
                    const newMicId = e.target.value;
                    setSelectedMicrophone(newMicId);
                    setSavedMicrophoneId(newMicId);
                    
                    // Only start stream if mic is currently on
                    if (isMicOn) {
                      startStream(null, newMicId, false, true);
                    }
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    darkMode 
                      ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500" 
                      : "bg-blue-50/80 border-gray-300 text-gray-800 focus:border-teal-500"
                  } focus:outline-none transition-colors`}
                  disabled={isRefreshing}
                >
                  <option value="">Default Microphone</option>
                  {devices.audio?.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.substring(0, 8)}...`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh Button - IMPROVED */}
              <div className="flex justify-end">
                <motion.button
                  onClick={retryStream}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isRefreshing}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                    isRefreshing 
                      ? (darkMode ? "bg-slate-600 text-cyan-300" : "bg-blue-200 text-teal-500")
                      : (darkMode ? "bg-slate-700 hover:bg-slate-600 text-cyan-400" : "bg-blue-100 hover:bg-blue-200 text-teal-600")
                  } ${isRefreshing ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <RefreshCw size={16} className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh Devices"}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Controls - IMPROVED */}
          <div className="flex items-center justify-center mt-6 space-x-6">
            <motion.button
              onClick={toggleCamera}
              whileHover={{ scale: 1.1, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.9 }}
              disabled={isRefreshing}
              className={`p-4 rounded-full transition-all ${
                isCameraOn
                  ? (darkMode ? "bg-green-600/70 text-white hover:bg-green-500" : "bg-green-500 hover:bg-green-400 text-white")
                  : (darkMode ? "bg-red-600/70 text-white hover:bg-red-500" : "bg-red-500 hover:bg-red-400 text-white")
              } ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={isCameraOn ? "Turn camera off" : "Turn camera on"}
            >
              {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
            </motion.button>
            
            <motion.button
              onClick={toggleMic}
              whileHover={{ scale: 1.1, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.9 }}
              disabled={isRefreshing}
              className={`p-4 rounded-full transition-all ${
                isMicOn
                  ? (darkMode ? "bg-green-600/70 text-white hover:bg-green-500" : "bg-green-500 hover:bg-green-400 text-white")
                  : (darkMode ? "bg-red-600/70 text-white hover:bg-red-500" : "bg-red-500 hover:bg-red-400 text-white")
              } ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
            >
              {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </motion.button>
          </div>

          {/* Enter Room Button */}
          <div className="flex justify-center mt-6">
            <Link to={`/room/${roomid}`}>
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: darkMode 
                    ? "0px 8px 15px rgba(8, 145, 178, 0.5)" 
                    : "0px 8px 15px rgba(20, 184, 166, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-lg shadow-md transition-all ${
                  darkMode
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                    : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                }`}
              >
                Enter Room
              </motion.button>
            </Link>
          </div>
          
          {/* Device Status with improved indicators */}
          <div className={`mt-4 text-center text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            <div className="flex justify-center items-center space-x-4">
              <span className="flex items-center">
                <span className={`inline-block w-2 h-2 mr-1 rounded-full ${isCameraOn ? "bg-green-500" : "bg-red-500"}`}></span>
                Camera: {isCameraOn ? "On" : "Off"}
              </span>
              <span className="flex items-center">
                <span className={`inline-block w-2 h-2 mr-1 rounded-full ${isMicOn ? "bg-green-500" : "bg-red-500"}`}></span>
                Microphone: {isMicOn ? "On" : "Off"}
              </span>
            </div>
            
            {/* Helpful message about saved device selections */}
            {(!isCameraOn && savedCameraId) || (!isMicOn && savedMicrophoneId) ? (
              <p className="mt-2 text-xs">
                {!isCameraOn && savedCameraId ? "Camera" : ""}
                {!isCameraOn && savedCameraId && !isMicOn && savedMicrophoneId ? " and " : ""}
                {!isMicOn && savedMicrophoneId ? "Microphone" : ""}
                {" selection will be applied when turned back on"}
              </p>
            ) : null}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SetupPage;