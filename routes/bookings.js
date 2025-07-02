const express = require("express");
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const SeatLock = require("../models/SeatLock");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// Unlock seats (deactivate a seat lock)
router.post("/unlock-seats", authMiddleware, async (req, res) => {
  try {
    const { lockId } = req.body;
    const userId = req.user.id;
    if (!lockId) {
      return res.status(400).json({ error: "Missing lockId" });
    }
    const seatLock = await SeatLock.findById(lockId);
    if (!seatLock || !seatLock.isActive || seatLock.user.toString() !== userId.toString()) {
      return res.status(400).json({ error: "Invalid or expired seat lock" });
    }
    seatLock.isActive = false;
    await seatLock.save();
    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error while unlocking seats" });
  }
});

// Lock seats for booking (atomic operation)
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

    // Use a transaction to ensure atomicity
    const session = await SeatLock.startSession();
    session.startTransaction();
    try {
      // Check for existing active locks or bookings for these seats
      const existingLocks = await SeatLock.find({
        show: showId,
        isActive: true,
        seats: { $in: seats },
      }).session(session);
      if (existingLocks.length > 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({ error: "Some seats are already locked" });
      }
      // Check for already booked seats
      const bookings = await Booking.find({
        show: showId,
        bookingStatus: { $in: ["confirmed", "pending"] },
        seats: { $in: seats },
      }).session(session);
      if (bookings.length > 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({ error: "Some seats are already booked" });
      }
      const seatLock = await SeatLock.create([{ show: showId, user: userId, seats: seats }], { session });
      await session.commitTransaction();
      session.endSession();
      res.json({
        success: true,
        data: {
          lockId: seatLock[0]._id,
          seats: seats,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: "Server error while locking seats" });
    }
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
      .populate("movie", "_id")
      .populate("venue", "_id");

    if (!show || !show.isActive) {
      return res.status(404).json({ error: "Show not found or inactive" });
    }

    if (!userId || !showId || !show.movie || !show.venue) {
      return res
        .status(400)
        .json({ error: "Missing required booking references" });
    }
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: "No seats selected" });
    }
    if (!["card", "upi", "netbanking", "wallet"].includes(paymentMethod)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }
    if (!show.screen || !show.screen.name) {
      return res.status(400).json({ error: "Show screen information missing" });
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

    // Debug log for booking payload
    console.log({
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
      bookingStatus: "confirmed",
      paymentStatus: "completed",
    });

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
      bookingStatus: "confirmed",
      paymentStatus: "completed",
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
    console.error("Booking creation error:", error);
    res.status(500).json({ error: error.message || "Server error while creating booking" });
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
