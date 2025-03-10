const Joi = require("joi");

// Signup Validation
const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string().trim().min(3).max(100).required().messages({
      "string.empty": "Full name is required",
      "string.min": "Full name must be at least 3 characters",
      "string.max": "Full name must not exceed 100 characters",
    }),
    email: Joi.string().trim().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).max(100).required().messages({
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must not exceed 100 characters",
      "string.empty": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body) ;

  if (error) {
    return res.status(400).json({ message: "Bad Request",error});
  }

  next();
};

// Login Validation
const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).max(100).required().messages({
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must not exceed 100 characters",
      "string.empty": "Password is required",
    }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ message: error.details.map((err) => err.message) });
  }

  next();
};

module.exports = { signupValidation, loginValidation };
