import Joi from "joi";

export const createAdminValidator = Joi.object({
  name: Joi.string().trim().min(3).max(255).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 255 characters.",
    "any.required": "Name is required.",
  }),

  email: Joi.string().trim().email().max(255).required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "string.max": "Email cannot exceed 255 characters.",
    "any.required": "Email is required.",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": "Phone number must contain exactly 10 digits.",
      "any.required": "Phone number is required.",
    }),

  password: Joi.string()
    .min(8)
    .max(255)
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,}$/,
    )
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 255 characters.",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),

  avatar: Joi.string().trim().optional().allow(null, ""),

  otp: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "OTP must be exactly 6 digits.",
    }),
});
