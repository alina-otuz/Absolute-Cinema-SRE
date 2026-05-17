import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(2).max(40).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(72).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(72).required()
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().min(10).required()
});
