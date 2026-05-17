import Joi from "joi";

const seatRegex = /^[A-Z]\d{1,2}$/;

export const createBookingSchema = Joi.object({
  showtimeId: Joi.string().required(),
  selectedSeats: Joi.array().items(Joi.string().pattern(seatRegex)).min(1).max(10).required()
});

