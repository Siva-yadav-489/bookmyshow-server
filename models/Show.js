const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
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
    screen: {
      name: {
        type: String,
        required: [true, "Screen name is required"],
      },
      capacity: {
        type: Number,
        required: [true, "Screen capacity is required"],
      },
    },
    date: {
      type: Date,
      required: [true, "Show date is required"],
    },
    time: {
      type: String,
      required: [true, "Show time is required"],
      match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time in HH:MM format",
      ],
    },
    price: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Price cannot be negative"],
    },
    availableSeats: {
      type: Number,
      required: [true, "Available seats count is required"],
      min: [0, "Available seats cannot be negative"],
    },
    totalSeats: {
      type: Number,
      required: [true, "Total seats count is required"],
      min: [1, "Total seats must be at least 1"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showType: {
      type: String,
      enum: ["2D", "3D", "4DX", "IMAX"],
      default: "2D",
    },
    language: {
      type: String,
      required: [true, "Show language is required"],
    },
    subtitles: {
      type: String,
      default: "None",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
showSchema.index({ movie: 1, venue: 1, date: 1 });
showSchema.index({ venue: 1, date: 1 });
showSchema.index({ date: 1, isActive: 1 });

module.exports = mongoose.model("Show", showSchema);
