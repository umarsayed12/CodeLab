import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuth: false,
  userData: null,
  isLoading: true, // New state to track authentication loading
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuth = true;
      state.userData = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.isAuth = false;
      state.userData = null;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;


export const checkAuth = () => async (dispatch) => {
  dispatch(setLoading(true)); // Start loading
  try {
    const response = await axios.get(`https://codelab-sq6v.onrender.com/user/current-user`, {
      withCredentials: true,
    });

    if (response.data.success) {
      dispatch(login(response.data.user));
     
    } else {
      dispatch(logout());
    }
  } catch (error) {
    // console.log("No user Logged In:");
    dispatch(logout());
  } finally {
    dispatch(setLoading(false)); // ✅ Ensure loading stops even if there's an error
  }
};

