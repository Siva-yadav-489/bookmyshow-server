const express = require("express");
const Movie = require("../models/Movie");
const Show = require("../models/Show");
const Venue = require("../models/Venue");

const router = express.Router();

// Get all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true }).sort({
      releaseDate: -1,
    });

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching movies" });
  }
});

// Filter movies
router.get("/filter", async (req, res) => {
  try {
    const { search, genre, language } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (genre) {
      query.genre = { $in: [genre] };
    }
    if (language) {
      query.language = language;
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1 });

    res.json({
      success: true,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while filtering movies" });
  }
});

// Filter movies by date
router.get("/filter/date/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const shows = await Show.find({
      date: { $gte: searchDate, $lt: nextDate },
      isActive: true,
    })
      .populate("movie", "title posterUrl genre duration language certificate")
      .populate("venue", "name address city")
      .sort({ date: 1, time: 1 });

    const moviesMap = new Map();
    shows.forEach((show) => {
      const movieId = show.movie._id.toString();
      if (!moviesMap.has(movieId)) {
        moviesMap.set(movieId, { movie: show.movie, shows: [] });
      }
      moviesMap.get(movieId).shows.push({
        _id: show._id,
        venue: show.venue,
        date: show.date,
        time: show.time,
        price: show.price,
        availableSeats: show.availableSeats,
        showType: show.showType,
      });
    });

    res.json({ success: true, data: Array.from(moviesMap.values()) });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while filtering movies by date" });
  }
});

// Get movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching movie" });
  }
});

// Search movies by city
router.get("/search/city/:city", async (req, res) => {
  try {
    const { city } = req.params;

    const venues = await Venue.find({
      city: { $regex: city, $options: "i" },
      isActive: true,
    }).select("_id");

    const venueIds = venues.map((venue) => venue._id);
    const showQuery = { venue: { $in: venueIds }, isActive: true };

    const shows = await Show.find(showQuery)
      .populate("movie", "title posterUrl genre duration language certificate")
      .populate("venue", "name address")
      .sort({ date: 1, time: 1 });

    const moviesMap = new Map();
    shows.forEach((show) => {
      const movieId = show.movie._id.toString();
      if (!moviesMap.has(movieId)) {
        moviesMap.set(movieId, { movie: show.movie, shows: [] });
      }
      moviesMap.get(movieId).shows.push({
        _id: show._id,
        venue: show.venue,
        date: show.date,
        time: show.time,
        price: show.price,
        availableSeats: show.availableSeats,
        showType: show.showType,
      });
    });

    res.json({ success: true, data: Array.from(moviesMap.values()) });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while searching movies by city" });
  }
});

module.exports = router;
