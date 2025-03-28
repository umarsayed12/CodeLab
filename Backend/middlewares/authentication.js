const { validateToken } = require("../services/authentication");


function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {

    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      req.user = null;
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload; // Attach user info to request
    } catch (error) {
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
  next();
}
module.exports = {
  checkForAuthenticationCookie,
  requireAuth
};
