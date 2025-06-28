# BookMyShow Backend API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: <your_jwt_token>
```

_Note: Your system uses the token directly without "Bearer " prefix_

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "city": "New York",
  "role": "user"
}
```

### 2. Login User

**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### 3. Get User Profile

**GET** `/auth/profile`
_Requires authentication_

### 4. Update User Profile

**PUT** `/auth/profile`
_Requires authentication_

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123"
}
```

### 5. Delete User Profile

**DELETE** `/auth/profile`
_Requires authentication_

### 6. Get All Users (Admin Only)

**GET** `/auth/admin`
_Requires admin authentication_

---

## 🎬 Movie Endpoints

### 1. Get All Movies

**GET** `/movies`
Returns all active movies sorted by release date (newest first).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "movie_id",
      "title": "The Avengers",
      "description": "Superhero movie",
      "genre": ["Action", "Adventure"],
      "duration": 143,
      "language": "English",
      "releaseDate": "2024-01-15",
      "posterUrl": "https://example.com/poster.jpg"
    }
  ]
}
```

### 2. Filter Movies

**GET** `/movies/filter`
Search and filter movies by various criteria.

**Query Parameters:**

- `search` - Search by title, description, or genre (text search)
- `genre` - Filter by specific genre (exact match)
- `language` - Filter by language (exact match)

**Examples:**

```bash
# Search for movies containing "avengers"
GET /api/movies/filter?search=avengers

# Filter by Action genre
GET /api/movies/filter?genre=Action

# Filter by English language
GET /api/movies/filter?language=English

# Combine search and genre filter
GET /api/movies/filter?search=avengers&genre=Action

# Combine all filters
GET /api/movies/filter?search=avengers&genre=Action&language=English
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "movie_id",
      "title": "The Avengers",
      "description": "Superhero movie",
      "genre": ["Action", "Adventure"],
      "duration": 143,
      "language": "English",
      "releaseDate": "2024-01-15",
      "posterUrl": "https://example.com/poster.jpg"
    }
  ]
}
```

### 3. Filter Movies by Date

**GET** `/movies/filter/date/:date`
Find movies that have shows on a specific date.

**Parameters:**
- `date` - Date in YYYY-MM-DD format (e.g., 2024-01-20)

**Examples:**

```bash
# Find movies showing on January 20, 2024
GET /api/movies/filter/date/2024-01-20

# Find movies showing on December 25, 2024
GET /api/movies/filter/date/2024-12-25
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "movie": {
        "_id": "movie_id",
        "title": "The Avengers",
        "posterUrl": "https://example.com/poster.jpg",
        "genre": ["Action", "Adventure"],
        "duration": 143,
        "language": "English",
        "certificate": "UA"
      },
      "shows": [
        {
          "_id": "show_id",
          "venue": {
            "_id": "venue_id",
            "name": "Cineplex Theater",
            "address": "123 Main St",
            "city": "New York"
          },
          "date": "2024-01-20T00:00:00.000Z",
          "time": "14:30",
          "price": 500,
          "availableSeats": 50,
          "showType": "2D"
        }
      ]
    }
  ]
}
```

### 4. Get Movie by ID

**GET** `/movies/:id`
Get a specific movie by its ID.

**Example:**
```bash
GET /api/movies/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "The Avengers",
    "description": "Superhero movie",
    "genre": ["Action", "Adventure"],
    "duration": 143,
    "language": "English",
    "releaseDate": "2024-01-15",
    "posterUrl": "https://example.com/poster.jpg",
    "director": "Joss Whedon",
    "cast": ["Robert Downey Jr.", "Chris Evans"],
    "certificate": "UA"
  }
}
```

### 5. Search Movies by City

**GET** `/movies/search/city/:city`
Find movies that have shows in a specific city.

**Examples:**

```bash
# Find movies in New York
GET /api/movies/search/city/New%20York

# Find movies in Los Angeles
GET /api/movies/search/city/Los%20Angeles
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "movie": {
        "_id": "movie_id",
        "title": "The Avengers",
        "posterUrl": "https://example.com/poster.jpg",
        "genre": ["Action", "Adventure"],
        "duration": 143,
        "language": "English",
        "certificate": "UA"
      },
      "shows": [
        {
          "_id": "show_id",
          "venue": {
            "_id": "venue_id",
            "name": "Cineplex Theater",
            "address": "123 Main St"
          },
          "date": "2024-01-20T00:00:00.000Z",
          "time": "14:30",
          "price": 500,
          "availableSeats": 50,
          "showType": "2D"
        }
      ]
    }
  ]
}
```

---

## 🏢 Venue Endpoints

### 1. Get All Venues

**GET** `/venues`
Returns all active venues sorted by name.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "venue_id",
      "name": "Cineplex Theater",
      "city": "New York",
      "address": "123 Main St",
      "venueType": "theater",
      "contactNumber": "1234567890",
      "email": "info@cineplex.com"
    }
  ]
}
```

### 2. Filter Venues

**GET** `/venues/filter`
Filter venues by various criteria.

**Query Parameters:**

- `city` - Filter by city (case-insensitive search)

**Examples:**

```bash
# Filter venues by city
GET /api/venues/filter?city=New%20York

# Filter venues by city (case-insensitive)
GET /api/venues/filter?city=new%20york
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "venue_id",
      "name": "Cineplex Theater",
      "city": "New York",
      "address": "123 Main St",
      "venueType": "theater",
      "contactNumber": "1234567890",
      "email": "info@cineplex.com"
    }
  ]
}
```

### 3. Get Venue by ID

**GET** `/venues/:id`
Get a specific venue by its ID.

**Example:**
```bash
GET /api/venues/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Cineplex Theater",
    "city": "New York",
    "address": "123 Main St",
    "venueType": "theater",
    "screens": [
      {
        "name": "Screen 1",
        "capacity": 100,
        "seatLayout": {
          "rows": 10,
          "seatsPerRow": 10
        },
        "amenities": ["Dolby Sound", "Recliner Seats"]
      }
    ],
    "contactNumber": "1234567890",
    "email": "info@cineplex.com"
  }
}
```

### 4. Get Venues by City

**GET** `/venues/city/:city`
Get all venues in a specific city.

**Example:**
```bash
GET /api/venues/city/New%20York
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "venue_id",
      "name": "Cineplex Theater",
      "city": "New York",
      "address": "123 Main St",
      "venueType": "theater"
    }
  ]
}
```

### 5. Get All Cities

**GET** `/venues/cities/all`
Get a list of all cities that have venues.

**Response:**
```json
{
  "success": true,
  "data": ["New York", "Los Angeles", "Chicago", "Houston"]
}
```

---

## 🎭 Show Endpoints

### 1. Get All Shows

**GET** `/shows`
Get all active shows with optional filtering.

**Query Parameters:**

- `movie` - Filter by movie ID
- `venue` - Filter by venue ID
- `date` - Filter by date

**Examples:**

```bash
# Get all shows
GET /api/shows

# Filter shows by movie
GET /api/shows?movie=movie_id_here

# Filter shows by venue
GET /api/shows?venue=venue_id_here

# Filter shows by date
GET /api/shows?date=2024-01-20

# Combine filters
GET /api/shows?movie=movie_id_here&date=2024-01-20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "show_id",
      "movie": {
        "_id": "movie_id",
        "title": "The Avengers",
        "posterUrl": "https://example.com/poster.jpg",
        "duration": 143
      },
      "venue": {
        "_id": "venue_id",
        "name": "Cineplex Theater",
        "address": "123 Main St"
      },
      "date": "2024-01-20T00:00:00.000Z",
      "time": "14:30",
      "price": 500,
      "availableSeats": 50,
      "showType": "2D"
    }
  ]
}
```

### 2. Get Show by ID

**GET** `/shows/:id`
Get a specific show by its ID.

**Example:**
```bash
GET /api/shows/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "movie": {
      "_id": "movie_id",
      "title": "The Avengers",
      "posterUrl": "https://example.com/poster.jpg",
      "duration": 143,
      "genre": ["Action", "Adventure"],
      "language": "English",
      "certificate": "UA"
    },
    "venue": {
      "_id": "venue_id",
      "name": "Cineplex Theater",
      "address": "123 Main St",
      "city": "New York"
    },
    "date": "2024-01-20T00:00:00.000Z",
    "time": "14:30",
    "price": 500,
    "availableSeats": 50,
    "showType": "2D"
  }
}
```

### 3. Get Shows by Movie

**GET** `/shows/movie/:movieId`
Get all shows for a specific movie.

**Example:**
```bash
GET /api/shows/movie/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "show_id",
      "venue": {
        "_id": "venue_id",
        "name": "Cineplex Theater",
        "address": "123 Main St",
        "city": "New York"
      },
      "date": "2024-01-20T00:00:00.000Z",
      "time": "14:30",
      "price": 500,
      "availableSeats": 50,
      "showType": "2D"
    }
  ]
}
```

### 4. Get Shows by Venue

**GET** `/shows/venue/:venueId`
Get all shows at a specific venue.

**Example:**
```bash
GET /api/shows/venue/64f8a1b2c3d4e5f6a7b8c9d0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "show_id",
      "movie": {
        "_id": "movie_id",
        "title": "The Avengers",
        "posterUrl": "https://example.com/poster.jpg",
        "duration": 143
      },
      "date": "2024-01-20T00:00:00.000Z",
      "time": "14:30",
      "price": 500,
      "availableSeats": 50,
      "showType": "2D"
    }
  ]
}
```

---

## 🎫 Booking Endpoints

### 1. Lock Seats

**POST** `/bookings/lock-seats`
_Requires authentication_

```json
{
  "showId": "show_id_here",
  "seats": [
    { "row": "A", "seatNumber": 1 },
    { "row": "A", "seatNumber": 2 }
  ]
}
```

### 2. Create Booking

**POST** `/bookings`
_Requires authentication_

```json
{
  "showId": "show_id_here",
  "seats": [
    { "row": "A", "seatNumber": 1, "price": 500 },
    { "row": "A", "seatNumber": 2, "price": 500 }
  ],
  "paymentMethod": "card",
  "lockId": "lock_id_here"
}
```

### 3. Get Booking History

**GET** `/bookings/history`
_Requires authentication_
**Query Parameters:**

- `status` - Filter by booking status

### 4. Get Booking by ID

**GET** `/bookings/:id`
_Requires authentication_

### 5. Get Available Seats

**GET** `/bookings/show/:showId/seats`

---

## 👨‍💼 Admin Endpoints

_All admin endpoints require admin role_

### 1. Add Movie

**POST** `/admin/movies`

```json
{
  "title": "The Avengers",
  "description": "Superhero movie",
  "genre": ["Action", "Adventure"],
  "duration": 143,
  "language": "English",
  "releaseDate": "2024-01-15",
  "posterUrl": "https://example.com/poster.jpg",
  "director": "Joss Whedon",
  "cast": ["Robert Downey Jr.", "Chris Evans"],
  "certificate": "UA"
}
```

### 2. Add Venue

**POST** `/admin/venues`

```json
{
  "name": "Cineplex Theater",
  "city": "New York",
  "address": "123 Main St",
  "venueType": "theater",
  "screens": [
    {
      "name": "Screen 1",
      "capacity": 100,
      "seatLayout": {
        "rows": 10,
        "seatsPerRow": 10
      },
      "amenities": ["Dolby Sound", "Recliner Seats"]
    }
  ],
  "contactNumber": "1234567890",
  "email": "info@cineplex.com"
}
```

### 3. Add Show

**POST** `/admin/shows`

```json
{
  "movie": "movie_id_here",
  "venue": "venue_id_here",
  "screen": {
    "name": "Screen 1",
    "capacity": 100
  },
  "date": "2024-01-20",
  "time": "14:30",
  "price": 500,
  "availableSeats": 100,
  "totalSeats": 100,
  "showType": "2D",
  "language": "English",
  "subtitles": "Hindi"
}
```

### 4. Get All Users

**GET** `/admin/users`

### 5. Get All Bookings

**GET** `/admin/bookings`

---

## 🔧 Health Check

### Check API Status

**GET** `/health`

---

## 📝 Example Usage

### Complete Booking Flow:

1. **Register a user:**

```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "city": "New York",
  "role": "user"
}
```

2. **Login to get token:**

```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

3. **Search for movies in your city:**

```bash
GET /api/movies/search/city/New%20York
```

4. **Get shows for a specific movie:**

```bash
GET /api/shows/movie/movie_id_here?city=New%20York
```

5. **Get available seats for a show:**

```bash
GET /api/bookings/show/show_id_here/seats
```

6. **Lock seats:**

```bash
POST /api/bookings/lock-seats
Authorization: your_token_here
{
  "showId": "show_id_here",
  "seats": [{"row": "A", "seatNumber": 1}]
}
```

7. **Create booking:**

```bash
POST /api/bookings
Authorization: your_token_here
{
  "showId": "show_id_here",
  "seats": [{"row": "A", "seatNumber": 1, "price": 500}],
  "paymentMethod": "card",
  "lockId": "lock_id_from_step_6"
}
```

8. **View booking history:**

```bash
GET /api/bookings/history
Authorization: your_token_here
```

---

## 🚀 Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**
   Create a `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookmyshow
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

3. **Start the server:**

```bash
npm start
```

4. **Test the API:**

```bash
curl http://localhost:5000/api/health
```

---

## 🔒 Security Features

- **JWT Authentication** for protected routes
- **Role-based access control** (user/admin)
- **Password hashing** with bcryptjs
- **Seat locking** with automatic expiration (5 minutes)
- **Input validation** and sanitization
- **Error handling** with detailed messages

---

## 📊 Database Models

- **User** - User accounts and authentication
- **Movie** - Movie information and metadata
- **Venue** - Theater/venue details with screens
- **Show** - Movie screenings at venues
- **Booking** - User bookings with seat details
- **SeatLock** - Temporary seat locks for concurrency

---

## 🎯 Core Features Implemented

✅ **User Registration & Login** - JWT-based authentication  
✅ **Search Movies/Events by City** - Find movies in specific cities  
✅ **Book Tickets with Seat Selection** - Complete booking flow  
✅ **Seat Locking** - Concurrency-safe seat management  
✅ **View Booking History** - User booking history  
✅ **Admin Panel** - Add movies, shows, venues (admin-only)

The backend is now complete and ready for production use!
