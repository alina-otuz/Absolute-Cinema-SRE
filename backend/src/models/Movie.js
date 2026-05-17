import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000
    },
    genre: {
      type: String,
      required: true,
      enum: ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Animation", "Romance"]
    },
    director: {
      type: String,
      required: true,
      trim: true
    },
    releaseDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // в минутах
      required: true,
      min: 1
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    posterUrl: {
      type: String,
      trim: true
    },
    cast: [String],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
