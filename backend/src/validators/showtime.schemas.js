import Joi from "joi";

const seatRegex = /^[A-Z]\d{1,2}$/; // A1..A99

export const createShowtimeSchema = Joi.object({
  movieId: Joi.string().required(),
  dateTime: Joi.date().iso().required(),
  price: Joi.number().min(0).required(),

  // можно передать список мест сразу
  availableSeats: Joi.array().items(Joi.string().pattern(seatRegex)).min(1).optional()
});

export const updateShowtimeSchema = Joi.object({
  movieId: Joi.string().optional(),
  dateTime: Joi.date().iso().optional(),
  price: Joi.number().min(0).optional(),
  availableSeats: Joi.array().items(Joi.string().pattern(seatRegex)).min(1).optional()
}).min(1);
