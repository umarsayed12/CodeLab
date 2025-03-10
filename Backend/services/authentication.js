const JWT = require("jsonwebtoken");

const secret =process.env.SECRET_KEY;

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    fullname:user.fullname,
    profileImage: user.profileImage,
  };
  const token = JWT.sign(payload, secret ,{
    expiresIn: "1d",
  });
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
