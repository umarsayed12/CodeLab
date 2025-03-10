const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
      console.log("Checking cookie:", cookieName);  // Should show "token"
      const tokenCookieValue = req.cookies[cookieName];
      console.log("Cookie value exists:", !!tokenCookieValue);
      
      if (!tokenCookieValue) {
          req.user = null;
          return next();//now request user vairable has only undeifnd or null value 
      }

      try {
          const userPayload = validateToken(tokenCookieValue);
          console.log('Cookie received:', req.cookies.token);
          console.log("Valid user found:", userPayload.email);
          req.user = userPayload;//now request  have these user vairable details
      } catch (error) {
          console.log("Token validation failed:", error.message);
          req.user = null;
      }
      return next();
  };
}


// Add a protected route middleware
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.send({message:'Please login to continue'});
  }
  console.log('User after auth:', req.user);
  next();
}
module.exports = {
  checkForAuthenticationCookie,
  requireAuth
};
