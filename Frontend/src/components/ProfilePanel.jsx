import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout, setLoading } from "../redux/authSlice";
import { X, UserCircle, FileDown, Settings, LogOut } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

const ProfilePanel = ({ panelOpen, onClose }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isProfilePanelOpen, setProfilePanel] = useState(panelOpen);
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  useEffect(() => {
    setProfilePanel(panelOpen);
  }, [panelOpen]);

  const handleLogout = () => {
    dispatch(setLoading(true));
    axios
      .post("http://localhost:5000/user/logout" , {} , { withCredentials: true }) //axios.post(url, data, config)
      .then((response) => {
        if (!response.data.success) {
          showErrorToast(response.data.message);
        } else {
          showSuccessToast(response.data.message);
          dispatch(logout());
          navigate("/login");
          if (onClose) onClose();
        }
      })
      .catch((err) => {
        showErrorToast(err.response?.data?.message || "Something went wrong!");
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const handleClose = () => {
    setProfilePanel(false);
    if (onClose) onClose();
  };

  if (isLoading) return <LoadingScreen title="Logging Out" message="Please wait..." />;
  if (!isProfilePanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end  bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className={`w-80 h-full shadow-lg flex flex-col rounded-l-2xl transition-all ${
          darkMode
            ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white"
            : "bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800"
        }`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${darkMode ? "border-gray-900" : "border-gray-200"}`}>
          <h2 className="font-semibold text-lg">Profile</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={22} />
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className={`flex flex-col items-center py-6 space-y-2 border-b ${darkMode ? "border-gray-900" : "border-gray-200"}`}>
          <motion.img
            src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : "/images/man.png"}
            alt="User Profile"
            className="h-20 w-20 rounded-full border-2 border-cyan-500 shadow-md"
            whileHover={{ scale: 1.05 }}
          />
          <h3 className="text-lg font-semibold">{user?.fullname || "John Doe"}</h3>
          <p className="text-sm">{user?.email || "john.doe@example.com"}</p>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col flex-grow p-4 space-y-4">
          <motion.div whileHover={{ x: 8, scale: 1.02 }} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition">
            <UserCircle size={22} />
            <span>Edit Profile</span>
          </motion.div>

          <motion.div whileHover={{ x: 8, scale: 1.02 }} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition">
            <FileDown size={22} />
            <span>Downloaded Files</span>
          </motion.div>

          <motion.div whileHover={{ x: 8, scale: 1.02 }} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition">
            <Settings size={22} />
            <span>Settings</span>
          </motion.div>
        </div>

        {/* Logout Button */}
        <div className={`p-4 border-t ${darkMode ? "border-gray-900" : "border-gray-200"}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg text-white ${
              darkMode
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            }`}
          >
            <LogOut size={22} />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePanel;
