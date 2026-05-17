import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    helpful: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
