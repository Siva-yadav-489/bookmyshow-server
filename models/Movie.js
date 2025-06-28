const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Movie description is required"],
    },
    genre: [
      {
        type: String,
      },
    ],
    duration: {
      type: Number,
      required: [true, "Movie duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    language: {
      type: String,
      required: [true, "Movie language is required"],
    },
    releaseDate: {
      type: Date,
    },
    posterUrl: {
      type: String,
    },
    trailerUrl: {
      type: String,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [10, "Rating cannot exceed 10"],
      default: 0,
    },
    director: {
      type: String,
    },
    cast: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    certificate: {
      type: String,
      enum: ["U", "UA", "A", "S"],
      default: "UA",
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
movieSchema.index({ title: "text", description: "text", genre: "text" });

module.exports = mongoose.model("Movie", movieSchema);
