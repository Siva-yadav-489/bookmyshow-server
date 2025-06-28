const express = require("express");
const Venue = require("../models/Venue");

const router = express.Router();

// Test route to verify venues are working
router.get("/test", async (req, res) => {
  res.json({ message: "Venues route is working!", timestamp: new Date() });
});

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
    const { city, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const venues = await Venue.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Venue.countDocuments(query);

    res.json({
      success: true,
      data: venues,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching venues" });
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
