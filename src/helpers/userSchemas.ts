import Joi from "joi";

export const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .pattern(
      new RegExp("^[a-zA-Z0-9!@#$%^&*()_+=\\-{}\\[\\]:;\"'<>,.?/`~|]{8,25}$")
    )
    .min(8)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

export const userRegistrationSchema = Joi.object().keys({
  firstName: Joi.string().required().messages({
    "any.required": "First Name is required",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "any.required": "Email is required",
  }),
  phone: Joi.string().optional().messages({
    "string.base": "Phone must be a string",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "any.required": "Password is required",
  }),
  address: Joi.object().optional().messages({
    "object.base": "Address must be a valid object",
  }),
  image: Joi.string().optional().messages({
    "string.base": "Image must be a valid string",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "Is Active must be a boolean",
  }),
  isVerified: Joi.boolean().optional().messages({
    "boolean.base": "Is Verified must be a boolean",
  }),
  howUserHeardAboutUs: Joi.string().optional().messages({
    "string.base": "How User Heard About Us must be a valid string",
  }),
  role: Joi.string().optional().valid("admin", "user", "mechanic").messages({
    "string.base": "Role must be a string",
    "any.only": "Role must be one of 'admin', 'user', or 'mechanic'",
  }),
});
