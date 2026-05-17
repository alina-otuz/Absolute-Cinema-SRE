import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

// GET /api/reviews/movie/:movieId - Get all reviews for a movie
export async function getMovieReviews(req, res, next) {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (e) {
    next(e);
  }
}

// POST /api/reviews - Create a review
export async function createReview(req, res, next) {
  try {
    const { movieId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ movieId, userId });
    if (existingReview) {
      return res.status(409).json({ message: "You already reviewed this movie" });
    }

    const review = await Review.create({
      movieId,
      userId,
      rating,
      comment
    });

    // Update movie rating
    const allReviews = await Review.find({ movieId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Movie.findByIdAndUpdate(movieId, { rating: avgRating });

    res.status(201).json(review);
  } catch (e) {
    next(e);
  }
}

// PUT /api/reviews/:id - Update review
export async function updateReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update movie rating
    const allReviews = await Review.find({ movieId: review.movieId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Movie.findByIdAndUpdate(review.movieId, { rating: avgRating });

    res.json(review);
  } catch (e) {
    next(e);
  }
}

// DELETE /api/reviews/:id - Delete review
export async function deleteReview(req, res, next) {
  try {
    const userId = req.user._id;

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const movieId = review.movieId;
    await Review.findByIdAndDelete(req.params.id);

    // Update movie rating
    const allReviews = await Review.find({ movieId });
    if (allReviews.length === 0) {
      await Movie.findByIdAndUpdate(movieId, { rating: 0 });
    } else {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await Movie.findByIdAndUpdate(movieId, { rating: avgRating });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (e) {
    next(e);
  }
}
