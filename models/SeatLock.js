const mongoose = require("mongoose");

const seatLockSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: [true, "Show is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    seats: [
      {
        row: {
          type: String,
          required: [true, "Seat row is required"],
        },
        seatNumber: {
          type: Number,
          required: [true, "Seat number is required"],
        },
      },
    ],
    lockedAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Automatically delete after 5 minutes (300 seconds)
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying and automatic cleanup
seatLockSchema.index({ show: 1, "seats.row": 1, "seats.seatNumber": 1 });
seatLockSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model("SeatLock", seatLockSchema);
