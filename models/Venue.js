const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    venueType: {
      type: String,
      enum: ["theater", "auditorium", "stadium", "concert-hall"],
      default: "theater",
    },
    screens: [
      {
        name: {
          type: String,
        },
        capacity: {
          type: Number,

          min: [1, "Capacity must be at least 1"],
        },
        seatLayout: {
          rows: {
            type: Number,

            min: [1, "Number of rows must be at least 1"],
          },
          seatsPerRow: {
            type: Number,

            min: [1, "Seats per row must be at least 1"],
          },
        },
        amenities: [
          {
            type: String,
          },
        ],
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
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

// Index for city-based search
venueSchema.index({ city: 1 });

module.exports = mongoose.model("Venue", venueSchema);
