// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { useEffect } from "react";
import {HomePage , HostPage , JoinPage , LoginPage , SignupPage , SetupPage , RoomPage}  from "./pages";

// CSS for animations
const App = () => {
 

  return (
      <Router >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/room/setup" element={<SetupPage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          
          
          {/* Add more routes as needed */}
        </Routes>
      </Router>
  );
};

export default App;

