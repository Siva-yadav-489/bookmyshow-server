const express = require("express");
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const SeatLock = require("../models/SeatLock");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Lock seats for booking
router.post("/lock-seats", authMiddleware, async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user.id;

    const show = await Show.findById(showId);
    if (!show || !show.isActive) {
      return res.status(404).json({ error: "Show not found or inactive" });
    }

    if (show.availableSeats < seats.length) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    const existingLocks = await SeatLock.find({
      show: showId,
      isActive: true,
      seats: { $in: seats },
    });

    if (existingLocks.length > 0) {
      return res.status(409).json({ error: "Some seats are already locked" });
    }

    const seatLock = await SeatLock.create({
      show: showId,
      user: userId,
      seats: seats,
    });

    res.json({
      success: true,
      data: {
        lockId: seatLock._id,
        seats: seats,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while locking seats" });
  }
});

// Create booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { showId, seats, paymentMethod, lockId } = req.body;
    const userId = req.user.id;

    const show = await Show.findById(showId)
      .populate("movie", "title")
      .populate("venue", "name address");

    if (!show || !show.isActive) {
      return res.status(404).json({ error: "Show not found or inactive" });
    }

    if (lockId) {
      const seatLock = await SeatLock.findById(lockId);
      if (
        !seatLock ||
        !seatLock.isActive ||
        seatLock.user.toString() !== userId.toString()
      ) {
        return res.status(400).json({ error: "Invalid or expired seat lock" });
      }
    }

    const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

    const booking = await Booking.create({
      user: userId,
      show: showId,
      movie: show.movie._id,
      venue: show.venue._id,
      seats: seats,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      showDate: show.date,
      showTime: show.time,
      screenName: show.screen.name,
      numberOfSeats: seats.length,
    });

    await Show.findByIdAndUpdate(showId, {
      $inc: { availableSeats: -seats.length },
    });

    if (lockId) {
      await SeatLock.findByIdAndUpdate(lockId, { isActive: false });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate("movie", "title posterUrl")
      .populate("venue", "name address");

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while creating booking" });
  }
});

// Get user's booking history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    const query = { user: userId };
    if (status) {
      query.bookingStatus = status;
    }

    const bookings = await Booking.find(query)
      .populate("movie", "title posterUrl")
      .populate("venue", "name address")
      .populate("show", "date time screen")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while fetching booking history" });
  }
});

// Get booking by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("movie", "title posterUrl")
      .populate("venue", "name address");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this booking" });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching booking" });
  }
});

// Get available seats for a show
router.get("/show/:showId/seats", async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await Show.findById(showId).populate("venue", "screens");

    if (!show) {
      return res.status(404).json({ error: "Show not found" });
    }

    // Get booked seats
    const bookings = await Booking.find({
      show: showId,
      bookingStatus: { $in: ["confirmed", "pending"] },
    });

    const bookedSeats = bookings.reduce((seats, booking) => {
      return seats.concat(
        booking.seats.map((seat) => `${seat.row}-${seat.seatNumber}`)
      );
    }, []);

    // Get locked seats
    const lockedSeats = await SeatLock.find({
      show: showId,
      isActive: true,
    });

    const lockedSeatIds = lockedSeats.reduce((seats, lock) => {
      return seats.concat(
        lock.seats.map((seat) => `${seat.row}-${seat.seatNumber}`)
      );
    }, []);

    // Generate all seats for the screen
    const screen = show.venue.screens.find((s) => s.name === show.screen.name);
    const allSeats = [];

    for (let row = 1; row <= screen.seatLayout.rows; row++) {
      for (let seat = 1; seat <= screen.seatLayout.seatsPerRow; seat++) {
        const seatId = `${String.fromCharCode(64 + row)}-${seat}`;
        const isBooked = bookedSeats.includes(seatId);
        const isLocked = lockedSeatIds.includes(seatId);

        allSeats.push({
          row: String.fromCharCode(64 + row),
          seatNumber: seat,
          seatId: seatId,
          isAvailable: !isBooked && !isLocked,
          price: show.price,
        });
      }
    }

    res.json({
      success: true,
      data: {
        show: show,
        seats: allSeats,
        totalSeats: screen.capacity,
        availableSeats: show.availableSeats,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching seats" });
  }
});

module.exports = router;
