import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    showtimeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Showtime" },

    selectedSeats: { type: [String], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
