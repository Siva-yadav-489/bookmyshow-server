const express = require("express");
const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Venue = require("../models/Venue");

const router = express.Router();

// Get all shows
router.get("/", async (req, res) => {
  try {
    const { movie, venue, date, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (movie) query.movie = movie;
    if (venue) query.venue = venue;
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDate };
    }

    const skip = (page - 1) * limit;
    const shows = await Show.find(query)
      .populate("movie", "title posterUrl duration")
      .populate("venue", "name address")
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Show.countDocuments(query);

    res.json({
      success: true,
      data: shows,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching shows" });
  }
});

// Get show by ID
router.get("/:id", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie", "title posterUrl duration genre language certificate")
      .populate("venue", "name address city");

    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    res.json({ success: true, data: show });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching show" });
  }
});

// Get shows by movie
router.get("/movie/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date, city } = req.query;

    const query = { movie: movieId, isActive: true };

    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDate };
    }

    let shows = await Show.find(query)
      .populate("venue", "name address city")
      .sort({ date: 1, time: 1 });

    if (city) {
      shows = shows.filter((show) =>
        show.venue.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    res.json({ success: true, data: shows });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while fetching shows by movie" });
  }
});

// Get shows by venue
router.get("/venue/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params;
    const { date } = req.query;

    const query = { venue: venueId, isActive: true };

    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDate };
    }

    const shows = await Show.find(query)
      .populate("movie", "title posterUrl duration")
      .sort({ date: 1, time: 1 });

    res.json({ success: true, data: shows });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while fetching shows by venue" });
  }
});

module.exports = router;
