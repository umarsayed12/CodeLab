
import { createSlice } from "@reduxjs/toolkit";

const initialDarkMode = localStorage.getItem("darkMode") === "true"; 
// i use local storage to make t persisit the value on different pages  when i directly visit to same origin page if i don't use local storgoae then the value 
//will not persist 
//i can store this on localstorage , cookies , token, or take help from redux- persist library

const themeSlice = createSlice({
  name: "theme",
  initialState: { darkMode: initialDarkMode },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;



 /* WITH REDUX PERSIST remove any storage  */

/* 
import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { darkMode: false }, // Redux Persist will handle loading the stored value
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode; // No need to manually store in localStorage
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
 */