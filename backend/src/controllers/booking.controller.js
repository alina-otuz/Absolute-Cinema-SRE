import mongoose from "mongoose";
import Showtime from "../models/Showtime.js";
import Booking from "../models/Booking.js";

export async function createBooking(req, res, next) {
  try {
    const { showtimeId, selectedSeats } = req.body;

    // 1) атомарно "вырезаем" места из availableSeats,
    //    условие: все selectedSeats должны быть доступными
    const updatedShowtime = await Showtime.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(showtimeId),
        availableSeats: { $all: selectedSeats }
      },
      {
        $pull: { availableSeats: { $in: selectedSeats } }
      },
      { new: true }
    );

    if (!updatedShowtime) {
      return res.status(409).json({ message: "Some seats are already booked or invalid" });
    }

    const totalPrice = updatedShowtime.price * selectedSeats.length;

    const booking = await Booking.create({
      userId: req.user._id,
      showtimeId: updatedShowtime._id,
      selectedSeats,
      totalPrice,
      status: "confirmed"
    });

    res.status(201).json(booking);
  } catch (e) {
    next(e);
  }
}

export async function getBookingHistory(req, res, next) {
  try {
    const items = await Booking.find({ userId: req.user._id })
      .populate("showtimeId", "movieId dateTime price")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function getBookingDetails(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id).populate("showtimeId", "movieId dateTime price");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // доступ: владелец или admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(booking);
  } catch (e) {
    next(e);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // доступ: владелец или admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // 1) вернуть места обратно в showtime (addToSet чтобы не дублировать)
    await Showtime.findByIdAndUpdate(booking.showtimeId, {
      $addToSet: { availableSeats: { $each: booking.selectedSeats } }
    });

    // 2) поменять статус
    booking.status = "cancelled";
    await booking.save();

    res.json(booking);
  } catch (e) {
    next(e);
  }
}
