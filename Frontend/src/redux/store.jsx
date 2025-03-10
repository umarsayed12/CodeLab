import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import themeReducer from './themeSlice';


 const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
});

export default store;



/* WITH REDUX PERSIST LIBRARY */

// import { configureStore } from "@reduxjs/toolkit";
// import themeReducer from "./themeSlice";
// import authReducer from './authSlice';
// import { persistReducer, persistStore } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Uses localStorage

// const persistConfig = {
//   key: "theme",
//   storage, // Persists theme in localStorage
// };

// const persistedThemeReducer = persistReducer(persistConfig, themeReducer);

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     theme: persistedThemeReducer, // Use persisted reducer here
//   },
// });

// export const persistor = persistStore(store);
