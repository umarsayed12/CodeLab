const express = require('express');
const router = express.Router();
// const {signupValidation, loginValidation} = require("../middlewares/AuthValidation.js");
const {upload} = require("../middlewares/multerConfig.js");
const {handleSignUp} = require("../controllers/signup.js");
const {handleLogin} = require("../controllers/login.js");
const {handleLogOutPage} = require("../controllers/logout.js");
const {checkForAuthenticationCookie }= require('../middlewares/authentication.js');

router.get("/current-user", checkForAuthenticationCookie("token"), getUser)
.post("/signup" ,upload.single('profileImage') ,handleSignUp ) 
.post("/login" , handleLogin) //or say signin
.post("/logout",handleLogOutPage);
//Loogout remaining

function getUser(req, res){
    if (!req.user) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
      }
    
      return res.json({ success: true, user: req.user });
}



module.exports =router;