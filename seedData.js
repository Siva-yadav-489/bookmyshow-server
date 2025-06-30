const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Movie = require("./models/Movie");
const Venue = require("./models/Venue");
const Show = require("./models/Show");
const Booking = require("./models/Booking");

// Sample data
const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    phone: "1234567890",
    city: "New York",
    role: "user",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    phone: "0987654321",
    city: "Los Angeles",
    role: "user",
  },
  {
    name: "Admin User",
    email: "admin@bookmyshow.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    phone: "5555555555",
    city: "New York",
    role: "admin",
  },
];

const sampleMovies = [
  {
    title: "The Avengers",
    description:
      "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    genre: ["Action", "Adventure", "Sci-Fi"],
    duration: 143,
    language: "English",
    releaseDate: new Date("2024-01-15"),
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    trailerUrl: "https://example.com/avengers-trailer.mp4",
    rating: 8.0,
    director: "Joss Whedon",
    cast: [
      "Robert Downey Jr.",
      "Chris Evans",
      "Scarlett Johansson",
      "Mark Ruffalo",
    ],
    certificate: "UA",
  },
  {
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genre: ["Action", "Sci-Fi", "Thriller"],
    duration: 148,
    language: "English",
    releaseDate: new Date("2024-02-01"),
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    trailerUrl: "https://example.com/inception-trailer.mp4",
    rating: 8.8,
    director: "Christopher Nolan",
    cast: [
      "Leonardo DiCaprio",
      "Joseph Gordon-Levitt",
      "Ellen Page",
      "Tom Hardy",
    ],
    certificate: "UA",
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime", "Drama"],
    duration: 152,
    language: "English",
    releaseDate: new Date("2024-01-20"),
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    trailerUrl: "https://example.com/dark-knight-trailer.mp4",
    rating: 9.0,
    director: "Christopher Nolan",
    cast: [
      "Christian Bale",
      "Heath Ledger",
      "Aaron Eckhart",
      "Maggie Gyllenhaal",
    ],
    certificate: "UA",
  },
  {
    title: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    duration: 169,
    language: "English",
    releaseDate: new Date("2024-02-10"),
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    trailerUrl: "https://example.com/interstellar-trailer.mp4",
    rating: 8.6,
    director: "Christopher Nolan",
    cast: [
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Mackenzie Foy",
    ],
    certificate: "UA",
  },
  {
    title: "La La Land",
    description:
      "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    genre: ["Comedy", "Drama", "Musical"],
    duration: 128,
    language: "English",
    releaseDate: new Date("2024-01-25"),
    posterUrl:
      "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
    trailerUrl: "https://example.com/lalaland-trailer.mp4",
    rating: 8.0,
    director: "Damien Chazelle",
    cast: ["Ryan Gosling", "Emma Stone", "John Legend", "Rosemarie DeWitt"],
    certificate: "UA",
  },
];

const sampleVenues = [
  {
    name: "Cineplex Theater",
    city: "New York",
    address: "123 Main Street, Manhattan, NY 10001",
    venueType: "theater",
    screens: [
      {
        name: "Screen 1",
        capacity: 120,
        seatLayout: {
          rows: 12,
          seatsPerRow: 10,
        },
        amenities: ["Dolby Atmos", "4K Projection", "Recliner Seats"],
      },
      {
        name: "Screen 2",
        capacity: 80,
        seatLayout: {
          rows: 10,
          seatsPerRow: 8,
        },
        amenities: ["Dolby Digital", "3D Ready", "Premium Seating"],
      },
    ],
    contactNumber: "212-555-0123",
    email: "info@cineplexny.com",
  },
  {
    name: "Metro Cinema",
    city: "New York",
    address: "456 Broadway, Brooklyn, NY 11201",
    venueType: "theater",
    screens: [
      {
        name: "Main Hall",
        capacity: 150,
        seatLayout: {
          rows: 15,
          seatsPerRow: 10,
        },
        amenities: ["Dolby Atmos", "IMAX", "Premium Recliners"],
      },
    ],
    contactNumber: "718-555-0456",
    email: "contact@metrocinema.com",
  },
  {
    name: "Hollywood Multiplex",
    city: "Los Angeles",
    address: "789 Sunset Blvd, Hollywood, CA 90028",
    venueType: "theater",
    screens: [
      {
        name: "Screen 1",
        capacity: 200,
        seatLayout: {
          rows: 20,
          seatsPerRow: 10,
        },
        amenities: ["Dolby Atmos", "4K Laser Projection", "Premium Seating"],
      },
      {
        name: "Screen 2",
        capacity: 100,
        seatLayout: {
          rows: 10,
          seatsPerRow: 10,
        },
        amenities: ["Dolby Digital", "3D Ready", "Comfort Seating"],
      },
      {
        name: "VIP Screen",
        capacity: 50,
        seatLayout: {
          rows: 5,
          seatsPerRow: 10,
        },
        amenities: [
          "Dolby Atmos",
          "4K",
          "Fully Reclining Seats",
          "Food Service",
        ],
      },
    ],
    contactNumber: "323-555-0789",
    email: "info@hollywoodmultiplex.com",
  },
  {
    name: "Downtown Cinema",
    city: "Los Angeles",
    address: "321 Main St, Downtown LA, CA 90012",
    venueType: "theater",
    screens: [
      {
        name: "Main Auditorium",
        capacity: 180,
        seatLayout: {
          rows: 18,
          seatsPerRow: 10,
        },
        amenities: ["Dolby Atmos", "4K Projection", "Premium Seating"],
      },
    ],
    contactNumber: "213-555-0321",
    email: "hello@downtowncinema.com",
  },
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Venue.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    // Insert users
    console.log("Inserting users...");
    const users = await User.insertMany(sampleUsers);
    console.log(`Inserted ${users.length} users`);

    // Insert movies
    console.log("Inserting movies...");
    const movies = await Movie.insertMany(sampleMovies);
    console.log(`Inserted ${movies.length} movies`);

    // Insert venues
    console.log("Inserting venues...");
    const venues = await Venue.insertMany(sampleVenues);
    console.log(`Inserted ${venues.length} venues`);

    // Create shows
    console.log("Creating shows...");
    const shows = [];
    const currentDate = new Date();

    // Create shows for the next 7 days
    for (let i = 0; i < 7; i++) {
      const showDate = new Date(currentDate);
      showDate.setDate(currentDate.getDate() + i);

      // Create shows for each movie at each venue
      for (const movie of movies) {
        for (const venue of venues) {
          // Create 2-3 shows per day per movie per venue
          const showTimes = ["10:00", "14:30", "19:00"];

          for (const time of showTimes) {
            const [hours, minutes] = time.split(":");
            const showDateTime = new Date(showDate);
            showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // Only create shows for future dates
            if (showDateTime > currentDate) {
              const screen = venue.screens[0]; // Use first screen for simplicity

              shows.push({
                movie: movie._id,
                venue: venue._id,
                screen: {
                  name: screen.name,
                  capacity: screen.capacity,
                },
                date: showDateTime,
                time: time,
                price: Math.floor(Math.random() * 300) + 200, // Random price between 200-500
                availableSeats: screen.capacity,
                totalSeats: screen.capacity,
                showType: "2D",
                language: movie.language,
                subtitles: "English",
                isActive: true,
              });
            }
          }
        }
      }
    }

    await Show.insertMany(shows);
    console.log(`Inserted ${shows.length} shows`);

    // Create some sample bookings
    console.log("Creating sample bookings...");
    const sampleBookings = [];
    const regularUsers = users.filter((user) => user.role === "user");

    // Get some shows to create bookings for
    const availableShows = await Show.find({ isActive: true }).limit(10);

    for (const show of availableShows) {
      if (regularUsers.length > 0) {
        const user =
          regularUsers[Math.floor(Math.random() * regularUsers.length)];
        const numSeats = Math.floor(Math.random() * 3) + 1; // 1-3 seats

        const seats = [];
        for (let i = 0; i < numSeats; i++) {
          seats.push({
            row: String.fromCharCode(65 + Math.floor(Math.random() * 10)), // A-J
            seatNumber: Math.floor(Math.random() * 10) + 1,
            price: show.price,
          });
        }

        const totalAmount = seats.reduce((sum, seat) => sum + seat.price, 0);

        // Generate a unique booking code
        const bookingCode =
          "BK" +
          Date.now() +
          Math.random().toString(36).substr(2, 5).toUpperCase();

        sampleBookings.push({
          user: user._id,
          show: show._id,
          movie: show.movie,
          venue: show.venue,
          seats: seats,
          totalAmount: totalAmount,
          paymentMethod: "card",
          bookingCode: bookingCode,
          showDate: show.date,
          showTime: show.time,
          screenName: show.screen.name,
          numberOfSeats: seats.length,
          bookingStatus: "confirmed",
          paymentStatus: "completed",
        });
      }
    }

    await Booking.insertMany(sampleBookings);
    console.log(`Inserted ${sampleBookings.length} bookings`);

    console.log("Database seeded successfully!");
    console.log("\nSample Data Summary:");
    console.log(`- Users: ${users.length}`);
    console.log(`- Movies: ${movies.length}`);
    console.log(`- Venues: ${venues.length}`);
    console.log(`- Shows: ${shows.length}`);
    console.log(`- Bookings: ${sampleBookings.length}`);

    console.log("\nSample Login Credentials:");
    console.log("User: john@example.com / password");
    console.log("Admin: admin@bookmyshow.com / password");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedDatabase();
