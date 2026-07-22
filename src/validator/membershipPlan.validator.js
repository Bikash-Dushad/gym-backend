import Joi from "joi";

export const createMembershipPlanValidator = Joi.object({
  title: Joi.string().trim().min(3).max(255).required().messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 255 characters.",
    "any.required": "Title is required.",
  }),
  validity: Joi.string().trim().min(1).max(255).required().messages({
    "string.empty": "Validity is required.",
    "string.min": "Validity cannot be empty.",
    "string.max": "Validity cannot exceed 255 characters.",
    "any.required": "Validity is required.",
  }),
  price: Joi.number().integer().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.integer": "Price must be an integer.",
    "number.positive": "Price must be greater than 0.",
    "any.required": "Price is required.",
  }),
});
