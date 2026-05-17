import { Router } from "express";
import Joi from "joi";
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  listMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie
} from "../controllers/movie.controller.js";

const router = Router();

// Movie validation schemas
const createMovieSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  genre: Joi.string().valid("Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Animation", "Romance").required(),
  director: Joi.string().min(1).max(100).required(),
  releaseDate: Joi.date().required(),
  duration: Joi.number().min(1).required(),
  posterUrl: Joi.string().allow(""),
  cast: Joi.array().items(Joi.string())
});

const updateMovieSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  description: Joi.string().min(10).max(2000),
  genre: Joi.string().valid("Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Animation", "Romance"),
  director: Joi.string().min(1).max(100),
  releaseDate: Joi.date(),
  duration: Joi.number().min(1),
  posterUrl: Joi.string().allow(""),
  cast: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
  rating: Joi.number().min(0).max(10)
}).min(1);

// Public routes
router.get("/", listMovies);
router.get("/:id", getMovie);

// Admin routes
router.post("/", requireAuth, requireRole("admin"), validate(createMovieSchema), createMovie);
router.put("/:id", requireAuth, requireRole("admin"), validate(updateMovieSchema), updateMovie);
router.delete("/:id", requireAuth, requireRole("admin"), deleteMovie);

export default router;
