import Showtime from "../models/Showtime.js";

export async function listShowtimes(req, res, next) {
  try {
    const { movieId } = req.query;
    const filter = {};
    if (movieId) filter.movieId = movieId;

    const items = await Showtime.find(filter).sort({ dateTime: 1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function getShowtime(req, res, next) {
  try {
    const item = await Showtime.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Showtime not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function createShowtime(req, res, next) {
  try {
    const item = await Showtime.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function updateShowtime(req, res, next) {
  try {
    const item = await Showtime.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Showtime not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function deleteShowtime(req, res, next) {
  try {
    const item = await Showtime.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Showtime not found" });
    res.json({ message: "Showtime deleted" });
  } catch (e) {
    next(e);
  }
}
