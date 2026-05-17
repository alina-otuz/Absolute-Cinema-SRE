import Movie from "../models/Movie.js";

// GET /api/movies - Get all movies
export async function listMovies(req, res, next) {
  try {
    const { genre, isActive = true } = req.query;
    
    const filter = { isActive };
    if (genre) filter.genre = genre;

    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (e) {
    next(e);
  }
}

// GET /api/movies/:id - Get movie details
export async function getMovie(req, res, next) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (e) {
    next(e);
  }
}

// POST /api/movies - Create new movie (admin only)
export async function createMovie(req, res, next) {
  try {
    const { title, description, genre, director, releaseDate, duration, posterUrl, cast } = req.body;

    const movie = await Movie.create({
      title,
      description,
      genre,
      director,
      releaseDate,
      duration,
      posterUrl,
      cast: cast || []
    });

    res.status(201).json(movie);
  } catch (e) {
    next(e);
  }
}

// PUT /api/movies/:id - Update movie (admin only)
export async function updateMovie(req, res, next) {
  try {
    const { title, description, genre, director, releaseDate, duration, posterUrl, cast, isActive, rating } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        genre,
        director,
        releaseDate,
        duration,
        posterUrl,
        cast,
        isActive,
        rating
      },
      { new: true, runValidators: true }
    );

    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (e) {
    next(e);
  }
}

// DELETE /api/movies/:id - Delete movie (admin only)
export async function deleteMovie(req, res, next) {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted successfully" });
  } catch (e) {
    next(e);
  }
}
