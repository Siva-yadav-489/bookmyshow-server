const express = require("express");
const Venue = require("../models/Venue");

const router = express.Router();

// Get all cities (most specific route first)
router.get("/cities/all", async (req, res) => {
  try {
    const cities = await Venue.distinct("city");
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching cities" });
  }
});

// Get venues by city (more specific than :id)
router.get("/city/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const venues = await Venue.find({
      city: { $regex: city, $options: "i" },
      isActive: true,
    }).sort({ name: 1 });

    res.json({ success: true, data: venues });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while fetching venues by city" });
  }
});

// Get all venues
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find({ isActive: true }).sort({ name: 1 });

    res.json({
      success: true,
      data: venues,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching venues" });
  }
});

// Filter venues
router.get("/filter", async (req, res) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    const venues = await Venue.find(query).sort({ name: 1 });

    res.json({
      success: true,
      data: venues,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while filtering venues" });
  }
});

// Get venue by ID (least specific route last)
router.get("/:id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.json({ success: true, data: venue });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching venue" });
  }
});

module.exports = router;
