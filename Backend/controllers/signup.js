const User = require("../models/user");

// Email validation function
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

async function handleSignUp(req, res) {
  try {
    const { fullname, email, password } = req.body;
    console.log("📩 Signup request received:", req.body, "\n");

    // ✅ Validate Required Fields
    if (!fullname?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        status: "warning",
        message: "⚠ All fields are required.",
      });
    }

    // ✅ Validate Email Format
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "warning",
        message: "⚠ Please enter a valid email address.",
      });
    }

    // ✅ Validate Password Length
    if (password.length < 6) {
      return res.status(400).json({
        status: "warning",
        message: "⚠ Password must be at least 6 characters long.",
      });
    }

    // ✅ Check If User Already Exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("🚨 User already exists!");
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists.",
      });
    }


      // ✅ Get Profile Image Path from Multer as we cofigured multer as an middleware after succefully uploading the file 
      // const profileImage = req.file ? `/uploads/userProfiles/${req.file.filename}` : `/public/uploads/userProfile/man.png`;
      // as we server /uploads as static in app.js file 
       // ✅ Check for Uploaded Image, Else Use Default

       const profileImagePath = req.file
       ? `/uploads/userProfiles/${req.file.filename}`
       : `/uploads/userProfiles/man.png`; // Default profile image 

     
      console.log("after Upoading middleware the path is :", profileImagePath,"\n","the req.file in signup is : ",req.file);
    // ✅ Create a New User , and stored the image path in database
    const newUser = await User.create({
      fullname,
      email,
      password,
      profileImage:profileImagePath,
    });

    console.log("✅ Signup Successful:", newUser);

    // ✅ Send Response with User Data (excluding password)
    return res.status(201).json({
      status: "success",
      message: "🎉 User registered successfully!",
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error during registration. Please try again later.",
    });
  }
}

module.exports = { handleSignUp };
