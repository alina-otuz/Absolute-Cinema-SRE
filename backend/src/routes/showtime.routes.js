import { Router } from "express";
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import {
  listShowtimes,
  getShowtime,
  createShowtime,
  updateShowtime,
  deleteShowtime
} from "../controllers/showtime.controller.js";
import { createShowtimeSchema, updateShowtimeSchema } from "../validators/showtime.schemas.js";

const router = Router();

// Public
router.get("/", listShowtimes);
router.get("/:id", getShowtime);

// Admin only
router.post("/", requireAuth, requireRole("admin"), validate(createShowtimeSchema), createShowtime);
router.put("/:id", requireAuth, requireRole("admin"), validate(updateShowtimeSchema), updateShowtime);
router.delete("/:id", requireAuth, requireRole("admin"), deleteShowtime);

export default router;
