const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: [true, "Show is required"],
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "Movie is required"],
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue is required"],
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
        price: {
          type: Number,
          required: [true, "Seat price is required"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet"],
      required: [true, "Payment method is required"],
    },
    bookingCode: {
      type: String,
      unique: true,
      required: [true, "Booking code is required"],
    },
    showDate: {
      type: Date,
      required: [true, "Show date is required"],
    },
    showTime: {
      type: String,
      required: [true, "Show time is required"],
    },
    screenName: {
      type: String,
      required: [true, "Screen name is required"],
    },
    numberOfSeats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: [1, "At least one seat must be booked"],
    },
    cancellationReason: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ show: 1, bookingStatus: 1 });
bookingSchema.index({ bookingStatus: 1, createdAt: 1 });

// Generate booking code before saving
bookingSchema.pre("save", function (next) {
  if (!this.bookingCode) {
    this.bookingCode =
      "BK" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
