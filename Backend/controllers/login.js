const User = require("../models/user");
// Email validation function
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log("🚀 Entry Point of Login Auth:", req.body);

      // ✅ Validate Required Fields
      if (!email?.trim() || !password?.trim()) {
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

    // ✅ Verify user credentials & generate token
    const result = await User.matchPasswordAndGenerateToken(email, password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "❌ Invalid email or password.",
        status: "error", // 🔴 Error status
      });
    }

    const { token, user } = result;


    // ✅ Set the cookie securely
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    // });
    res.cookie("token", token);
    console.log("✅ Login Successful for:", user.email);

    return res.status(200).json({
      success: true,
      message: "🎉 Logged In Successfully! Redirecting...",
      status: "success", // ✅ Success status
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImage: user.profileImage,
      },
    });

  } catch (err) {
    console.error("⚠ Error during login:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message || "❌ Internal Server Error.",
      status: "error", // 🔴 Error status
    });
  }
}



module.exports = {handleLogin};