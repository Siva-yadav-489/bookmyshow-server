const express = require("express");
const Movie = require("../models/Movie");
const Venue = require("../models/Venue");
const Show = require("../models/Show");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const router = express.Router();

// Add a new movie
router.post("/movies", adminMiddleware, async (req, res) => {
  try {
    console.log("Creating movie with data:", req.body);
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    console.error("Movie creation error:", error);
    res.status(500).json({
      error: "Server error while adding movie",
      details: error.message,
    });
  }
});

// Add a new venue
router.post("/venues", adminMiddleware, async (req, res) => {
  try {
    console.log("Creating venue with data:", req.body);
    const venue = await Venue.create(req.body);
    res.status(201).json({ success: true, data: venue });
  } catch (error) {
    console.error("Venue creation error:", error);
    res.status(500).json({
      error: "Server error while adding venue",
      details: error.message,
    });
  }
});

// Add a new show
router.post("/shows", adminMiddleware, async (req, res) => {
  try {
    console.log("Creating show with data:", req.body);
    const show = await Show.create(req.body);
    res.status(201).json({ success: true, data: show });
  } catch (error) {
    console.error("Show creation error:", error);
    res.status(500).json({
      error: "Server error while adding show",
      details: error.message,
    });
  }
});

// Get all users (admin only)
router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const User = require("../models/User");
    const users = await User.find({}).select("-password");
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

// Get all bookings (admin only)
router.get("/bookings", adminMiddleware, async (req, res) => {
  try {
    const Booking = require("../models/Booking");
    const bookings = await Booking.find({})
      .populate("user", "name email")
      .populate("movie", "title")
      .populate("venue", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching bookings" });
  }
});

module.exports = router;
