import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createBooking,
  getBookingHistory,
  getBookingDetails,
  cancelBooking
} from "../controllers/booking.controller.js";
import { createBookingSchema } from "../validators/booking.schemas.js";

const router = Router();

// Private (user booking flow)
router.post("/", requireAuth, validate(createBookingSchema), createBooking);
router.get("/", requireAuth, getBookingHistory);
router.get("/:id", requireAuth, getBookingDetails);
router.put("/:id/cancel", requireAuth, cancelBooking);

export default router;
