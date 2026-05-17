import { Router } from "express";
import Joi from "joi";
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getMovieReviews,
  createReview,
  updateReview,
  deleteReview
} from "../controllers/review.controller.js";

const router = Router();

// Review validation schemas
const createReviewSchema = Joi.object({
  movieId: Joi.string().required(),
  rating: Joi.number().min(1).max(10).required(),
  comment: Joi.string().max(1000).allow("")
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(10),
  comment: Joi.string().max(1000).allow("")
}).min(1);

// Public routes
router.get("/movie/:movieId", getMovieReviews);

// User routes (authenticated)
router.post("/", requireAuth, validate(createReviewSchema), createReview);
router.put("/:id", requireAuth, validate(updateReviewSchema), updateReview);
router.delete("/:id", requireAuth, deleteReview);

export default router;
