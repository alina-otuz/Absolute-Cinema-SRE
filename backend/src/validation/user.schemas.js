import Joi from "joi";

export const updateProfileSchema = Joi.object({
  username: Joi.string().min(2).max(40),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(72)
}).min(1);
