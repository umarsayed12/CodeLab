// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { HomePage, HostPage, JoinPage, LoginPage, SignupPage, SetupPage, RoomPage } from "./pages";
// import { checkAuth } from "./redux/authSlice";

// const App = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth()); // Check authentication on app load
//   }, [dispatch]);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/join" element={<JoinPage />} />
//         <Route path="/host" element={<HostPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/room/setup" element={<SetupPage />} />
//         <Route path="/room/:roomId" element={<RoomPage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/HomePage"; // Now acts as the layout
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { HomeContent } from "./components";
import {
  HostPage,
  JoinPage,
  LoginPage,
  SignupPage,
  SetupPage,
  RoomPage,
} from "./pages";
import { checkAuth } from "./redux/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth()); // Check authentication on app load
  }, [dispatch]);
  
  // useEffect(() => {
  //   const verifyAuth = async () => {
  //     dispatch(checkAuth()); // Ensure the async action completes
  //   };
  //   verifyAuth();
  // }, [dispatch]);
  
  return (
    <Router>
      <Routes>
        {/* Main layout wraps all routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeContent />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="join" element={<JoinPage />} />
          <Route path="host" element={<HostPage />} />
          <Route path="room/setup" element={<SetupPage />} />{" "}
          {/* /room/setup */}
        </Route>

        {/* RoomPage Separate from Layout */}
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </Router>
  );
};

export default App;
