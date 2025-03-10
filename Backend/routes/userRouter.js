const express = require('express');
const router = express.Router();
// const {signupValidation, loginValidation} = require("../middlewares/AuthValidation.js");
const {upload} = require("../middlewares/multerConfig.js");
const {handleSignUp} = require("../controllers/signup.js");
const {handleLogin} = require("../controllers/login.js");
const {handleLogOutPage} = require("../controllers/logout.js");

//Signup and login
// router
// .post("/signup" ,signupValidation , handleSignUp ) 
// .post("/login" ,loginValidation, handleLogin) //or say signin
// .post("/logout",handleLogOutPage);
// //Loogout remaining

router
.post("/signup" ,upload.single('profileImage') ,handleSignUp ) 
.post("/login" , handleLogin) //or say signin
.post("/logout",handleLogOutPage);
//Loogout remaining



module.exports =router;