
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuth : false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true;
            state.userData = action.payload;
            console.log("Recieved the data in Slice " , action.payload);
        },
        logout:(state)=>{
            state.isAuth=false;
            state.userData=null;
            console.log("User logged out Succefully!! ");
        }
      
     }
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;