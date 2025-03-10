const { validateToken } = require("../services/authentication");


function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    console.log("Checking cookie:", cookieName);

    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      console.log("No authentication cookie found.");
      req.user = null;
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      console.log("Valid user found:", userPayload);
      req.user = userPayload; // Attach user info to request
    } catch (error) {
      console.log("Token validation failed:", error.message);
      req.user = null;
    }
    return next();
  };
}

module.exports = checkForAuthenticationCookie;



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
