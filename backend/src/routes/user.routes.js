import { Router } from "express";
import Joi from "joi";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

const router = Router();

const updateProfileSchema = Joi.object({
  username: Joi.string().min(2).max(40),
  email: Joi.string().email(),
  password: Joi.string().min(8).max(72)
}).min(1);

router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, validate(updateProfileSchema), updateProfile);

export default router;
