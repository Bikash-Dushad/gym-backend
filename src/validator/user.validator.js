import Joi from "joi";

export const createUserValidator = Joi.object({
  name: Joi.string().min(3).max(255).required().trim(),
  email: Joi.string().email().max(255).required().trim(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .optional(),
  age: Joi.number().integer().min(1).max(120).required(),
  height: Joi.number().min(1).max(10).required(),
  membershipPlanId: Joi.string().required().messages({
    "any.required": "Price is required.",
  }),
  price: Joi.number().positive().optional(),
  weight: Joi.number().required().messages({
    "any.required": "weight is required",
  }),
  type: Joi.string().allow(""),
  trainerId: Joi.string().allow(""),
});
