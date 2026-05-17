import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    availableSeats: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Showtime", showtimeSchema);
