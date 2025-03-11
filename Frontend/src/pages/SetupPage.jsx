import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Video, VideoOff, Mic, MicOff, RefreshCw, X } from "lucide-react";
import {Header, Footer ,  LoadingScreen} from "../components";

const SetupPage = () => {
  const navigate = useNavigate();
  const roomid = 123;
  const darkMode = useSelector((state) => state.theme?.darkMode) || false;
  const isAuthenticated = useSelector((state) => state.auth.isAuth);
  const isLoading = useSelector((state) => state.auth.isLoading); // Add loading state from Redux
  
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedMicrophone, setSelectedMicrophone] = useState(null);

  // Fetch available devices
  const fetchDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      setDevices({ video: videoDevices, audio: audioDevices });
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  // Start media stream
  const startStream = async (cameraId = null, micId = null) => {
    try {
      const constraints = {
        video: cameraId ? { deviceId: { exact: cameraId } } : true,
        audio: micId ? { deviceId: { exact: micId } } : true
      };
      
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
      setError("");
    } catch (error) {
      setError("⚠ Unable to access camera or microphone.");
      console.error(error);
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

  // Initial setup - IMPORTANT: Keep all useEffect hooks in the same order on all renders
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

  // Toggle camera
  const toggleCamera = async () => {
    if (isCameraOn) {
      stream?.getVideoTracks().forEach((track) => track.stop());
      setStream(null);
    } else {
      await startStream(selectedCamera);
    }
    setIsCameraOn(!isCameraOn);
  };

  // Toggle microphone
  const toggleMic = () => {
    stream?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsMicOn(!isMicOn);
  };

  // Retry stream
  const retryStream = () => {
    startStream(selectedCamera, selectedMicrophone);
  };

  // Enhanced Loading State - must come after all hooks are declared
  if (isLoading) {
    return <LoadingScreen 
      title="Loading" 
      message="Verifying your credentials..." 
    />;
  }

  // Prevent accessing setup if not authenticated - must come after all hooks are declared
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-all ${
        darkMode 
          ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
          : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`p-8 rounded-xl shadow-xl text-center ${
            darkMode 
              ? "border-2 border-sky-600 bg-slate-800" 
              : "border border-sky-200 bg-white/90 backdrop-blur-sm"
          }`}
        >
          <X className="mx-auto mb-4 text-red-500" size={48} />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-6">You must be logged in to access the setup page.</p>
          <motion.button
            onClick={() => navigate("/login", { 
              state: { 
                message: "Please log in to access the setup page.", 
                redirectFrom: "/setup" 
              } 
            })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg text-white transition ${
              darkMode 
                ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500" 
                : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
            }`}
          >
            Go to Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all ${
      darkMode 
        ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white" 
        : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
    }`}>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className={`w-full max-w-3xl p-6 rounded-lg shadow-xl ${
          darkMode 
            ? "border-2 border-sky-600 bg-slate-800" 
            : "border border-sky-200 bg-white/90 backdrop-blur-sm"
        }`}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`text-2xl font-bold text-center mb-4 ${
              darkMode ? "text-cyan-400" : "text-cyan-600"
            }`}
          >
            Setup Your Video & Audio
          </motion.p>

          {/* Animated Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center space-x-2 text-red-500 text-center font-semibold mb-4"
              >
                <X className="text-red-500" />
                <span>{error}</span>
                <motion.button 
                  onClick={retryStream}
                  whileHover={{ scale: 1.1 }}
                  className={`ml-2 p-2 rounded-full ${
                    darkMode ? "bg-red-900" : "bg-red-100"
                  }`}
                >
                  <RefreshCw size={16} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video Preview */}
            <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${
              darkMode ? "bg-slate-700" : "bg-blue-50/80"
            }`}>
              {isCameraOn ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className={`flex items-center justify-center w-full h-full ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  Camera Off
                </div>
              )}
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
                    setSelectedCamera(e.target.value);
                    startStream(e.target.value);
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    darkMode 
                      ? "bg-slate-700 border-slate-600 text-white" 
                      : "bg-blue-50/80 border-gray-300 text-gray-800"
                  }`}
                >
                  <option value="">Default Camera</option>
                  {devices.video?.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId}`}
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
                    setSelectedMicrophone(e.target.value);
                    startStream(selectedCamera, e.target.value);
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    darkMode 
                      ? "bg-slate-700 border-slate-600 text-white" 
                      : "bg-blue-50/80 border-gray-300 text-gray-800"
                  }`}
                >
                  <option value="">Default Microphone</option>
                  {devices.audio?.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center mt-6 space-x-6">
            <motion.button
              onClick={toggleCamera}
              whileHover={{ scale: 1.1 }}
              className={`p-4 rounded-full shadow-md transition ${
                darkMode 
                  ? "bg-slate-700 text-gray-100 hover:bg-slate-600" 
                  : "bg-blue-50 text-gray-900 hover:bg-blue-100"
              }`}
            >
              {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
            </motion.button>
            <motion.button
              onClick={toggleMic}
              whileHover={{ scale: 1.1 }}
              className={`p-4 rounded-full shadow-md transition ${
                darkMode 
                  ? "bg-slate-700 text-gray-100 hover:bg-slate-600" 
                  : "bg-blue-50 text-gray-900 hover:bg-blue-100"
              }`}
            >
              {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </motion.button>
          </div>

          {/* Enter Room Button */}
          <div className="flex justify-center mt-6">
            <Link to={`/room/${roomid}`}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 8px 15px rgba(14, 165, 233, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-lg shadow-md transition-all ${
                  darkMode 
                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white" 
                    : "bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
                }`}
              >
                Enter Room
              </motion.button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SetupPage;