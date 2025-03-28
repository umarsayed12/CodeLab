import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Copy, FileCode, Minimize2, Maximize2, ZoomIn, ZoomOut, Save } from "lucide-react";
import { useSelector } from "react-redux";

const CodeEditor = ({
  socket, code, language , setCode , setLanguage ,roomId  ,  parentIsFullScreen,
  isTyping , typingContent,
}) => {
 
  const [fontSize, setFontSize] = useState(14);
  const [isFullScreen, setIsFullScreen] = useState(parentIsFullScreen || false);
  const [isCopied, setIsCopied] = useState(false);
  const [showFullscreenNotice, setShowFullscreenNotice] = useState(false);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const noticeTimerRef = useRef(null);
  const darkMode = useSelector((state) => state.theme.darkMode);

  // Language options
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
  ];

  // Handle editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Enhanced fullscreen functionality with document events
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    
    // Add overflow hidden to body when in fullscreen to prevent scrolling
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
      setShowFullscreenNotice(true);
      
      // Auto-hide the fullscreen notice after 2 seconds
      noticeTimerRef.current = setTimeout(() => {
        setShowFullscreenNotice(false);
      }, 2000);
    } else {
      document.body.style.overflow = "";
      setShowFullscreenNotice(false);
      
      // Clear timer if exiting fullscreen
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
      
      // Clear timer on unmount
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    };
  }, [isFullScreen]);

  // Responsive resize functionality
  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Zoom in/out functionality
  const handleZoom = (direction) => {
    const newFontSize = direction === 'in' 
      ? Math.min(fontSize + 2, 30) 
      : Math.max(fontSize - 2, 10);
    setFontSize(newFontSize);
  };

  // Enhanced copy code functionality with visual feedback
  const handleCopyCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      navigator.clipboard.writeText(code).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    console.log("language change in frontend , new language is ", newLanguage);

    setLanguage(newLanguage);
    socket?.emit("language-change", { roomId, language: newLanguage });
  }

  const handleCodeChange = (newCode) => {
    console.log("Code Change", newCode);  
    setCode(newCode);
    socket.emit("code-change", { roomId, code: newCode });
    socket.emit("typing", { roomId });
  }

  // Toggle fullscreen with improved implementation
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // Force editor to relayout after animation completes
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    }, 310); // Slightly longer than the CSS transition
  };

  // Save functionality (placeholder)
  const handleSave = () => {
    // This could be replaced with actual save logic
    alert("Save functionality would be implemented here");
  };

  const bgColor = darkMode ? '#020617' : '#ffffff'; // slate-950 : white
  const borderColor = darkMode ? '#1E293B' : '#E0E7FF'; // slate-800 : indigo-100
  const toolbarBgGradient = darkMode 
    ? 'linear-gradient(to right, #020617, #1e1b4b)' // from-slate-950 to-indigo-950
    : 'linear-gradient(to right, #ffffff, #EEF2FF)'; // from-white to-indigo-50
  const controlBgColor = darkMode ? '#1E293B' : '#E0E7FF'; // slate-800 : indigo-100
  const textColor = darkMode ? '#ffffff' : '#1E293B'; // white : slate-800
  const accentColor = darkMode ? '#22D3EE' : '#0891B2'; // cyan-400 : cyan-600

  // Button gradients
  const copyButtonGradient = isCopied 
    ? 'linear-gradient(to right, #059669, #10B981)' // green-600 to green-500
    : 'linear-gradient(to right, #0891B2, #06B6D4)'; // cyan-600 to cyan-500
  const saveButtonGradient = 'linear-gradient(to right, #0284C7, #0EA5E9)'; // sky-600 to sky-500

  return (
    <div 
      ref={containerRef}
      style={{
        position: isFullScreen ? 'fixed' : 'relative',
        top: isFullScreen ? 0 : 'auto',
        left: isFullScreen ? 0 : 'auto',
        right: isFullScreen ? 0 : 'auto',
        bottom: isFullScreen ? 0 : 'auto',
        zIndex: isFullScreen ? 9999 : 'auto',
        height: isFullScreen ? '100vh' : '100%',
        width: isFullScreen ? '100vw' : '100%',
        display: 'flex',
        flexDirection: 'column',
        background: isFullScreen 
          ? (darkMode ? 'linear-gradient(to bottom right, #1e293b, #312e81, #1e293b)' : 'linear-gradient(to bottom right, #ffffff, #EEF2FF, #E0E7FF)')
          : bgColor,
        color: textColor,
        transition: 'all 300ms ease-in-out',
        borderRadius: isFullScreen ? 0 : '0.5rem',
        boxShadow: isFullScreen ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        border: isFullScreen ? 'none' : `1px solid ${borderColor}`,
        overflow: 'hidden'
      }}
    >
      {/* Toolbar - Enhanced with gradient and better spacing */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundImage: toolbarBgGradient,
        borderBottom: `1px solid ${borderColor}`,
        position: 'relative' // Added to position typing indicator
      }}>
        {/* Typing Indicator - New Addition */}
        {isTyping && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: darkMode 
              ? 'rgba(34, 211, 238, 0.8)' // Translucent cyan for dark mode
              : 'rgba(9, 141, 178, 0.7)', // Translucent cyan for light mode
            color: darkMode ? '#ffffff' : '#ffffff',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 500,
            animation: 'pulse 1.5s infinite',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            {typingContent}
          </div>
        )}

        {/* Left side controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* File icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: accentColor,
            marginRight: '8px'
          }}>
            <FileCode size={20} style={{ marginRight: '8px' }} />
            <span style={{ fontWeight: 600 }}>CodeLab</span>
          </div>
          
          {/* Language Selector - Enhanced */}
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{
              backgroundColor: controlBgColor,
              color: textColor,
              padding: '6px 12px',
              borderRadius: '6px',
              border: `1px solid ${borderColor}`,
              outline: 'none',
              fontSize: '14px',
              transition: 'all 150ms'
            }}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right side controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '0'
        }}>
          {/* Zoom Controls - Enhanced with icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '6px',
            backgroundColor: controlBgColor,
            border: `1px solid ${borderColor}`,
            overflow: 'hidden'
          }}>
            <button 
              onClick={() => handleZoom('out')}
              style={{
                padding: '6px 8px',
                transition: 'background-color 150ms',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: textColor
              }}
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span style={{
              padding: '4px 8px',
              borderLeft: `1px solid ${borderColor}`,
              borderRight: `1px solid ${borderColor}`
            }}>{fontSize}px</span>
            <button 
              onClick={() => handleZoom('in')}
              style={{
                padding: '6px 8px',
                transition: 'background-color 150ms',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: textColor
              }}
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Additional Controls - Enhanced */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Copy Code Button with better feedback */}
            <button 
              onClick={handleCopyCode}
              disabled={isCopied}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 150ms',
                background: copyButtonGradient, 
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0px 4px 10px rgba(6, 182, 212, 0.2)'
              }}
              title="Copy Code"
            >
              <Copy size={16} style={{ marginRight: '6px' }} /> 
              {isCopied ? 'Copied!' : 'Copy'}
            </button>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              style={{
                background: saveButtonGradient,
                color: 'white', 
                padding: '6px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 150ms',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0px 4px 10px rgba(14, 165, 233, 0.2)'
              }}
              title="Save Code"
            >
              <Save size={16} style={{ marginRight: '6px' }} /> Save
            </button>

            {/* Fullscreen Toggle - Fixed positioning */}
            <button 
              onClick={toggleFullScreen}
              style={{
                backgroundColor: controlBgColor,
                color: textColor,
                padding: '6px',
                borderRadius: '6px',
                transition: 'background-color 150ms',
                border: `1px solid ${borderColor}`,
                cursor: 'pointer'
              }}
              title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Global style for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.7; }
        }
      `}</style>

      {/* Monaco Editor - Improved container */}
      <div style={{
        flexGrow: 1,
        position: 'relative'
      }}>
        {/* Fullscreen indicator overlay - with auto-hide */}
        {isFullScreen && showFullscreenNotice && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: darkMode 
              ? 'rgba(30, 41, 59, 0.75)' // slate-800 with opacity (lighter)
              : 'rgba(255, 255, 255, 0.75)', // white with opacity
            fontSize: '12px',
            color: textColor,
            padding: '4px 8px',
            borderRadius: '6px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            transition: 'opacity 300ms ease',
            opacity: showFullscreenNotice ? 1 : 0
          }}>
            <Minimize2 size={12} style={{ marginRight: '4px' }} /> Press ESC to exit fullscreen
          </div>
        )}
        
        <Editor
          onMount={handleEditorDidMount}
          height="100%"
          width="100%"
          theme={darkMode ? "vs-dark" : "vs"}
          defaultLanguage={'javascript'}
          language={language}
          value={code || "// Write your code here..."}
          onChange={handleCodeChange}
          options={{
            fontSize: fontSize,
            fontFamily: "'Fira Code', 'Consolas', monospace",
            fontLigatures: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10 },
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            scrollbar: {
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              vertical: 'visible',
              horizontal: 'visible',
            },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;