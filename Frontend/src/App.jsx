// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { login } from "./redux/authSlice"; // Import Redux action
import { HomePage, HostPage, JoinPage, LoginPage, SignupPage, SetupPage, RoomPage } from "./pages";

const App = () => {
  const dispatch = useDispatch(); // ✅ Use dispatch from Redux

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/current-user", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          dispatch(login(response.data.user)); // ✅ Save user in Redux
        }
      })
      .catch((err) => console.log("Not logged in or error:", err.response?.data?.message));
  }, [dispatch]); // ✅ Add `dispatch` to dependencies

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/room/setup" element={<SetupPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </Router>
  );
};

export default App;
