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
**Query Parameters:**

- `search` - Search by title, description, or genre
- `genre` - Filter by genre
- `language` - Filter by language
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### 2. Get Movie by ID

**GET** `/movies/:id`

### 3. Search Movies by City

**GET** `/movies/search/city/:city`
**Query Parameters:**

- `date` - Filter by date (YYYY-MM-DD)
- `page` - Page number
- `limit` - Items per page

---

## 🏢 Venue Endpoints

### 1. Get All Venues

**GET** `/venues`
**Query Parameters:**

- `city` - Filter by city
- `page` - Page number
- `limit` - Items per page

### 2. Get Venue by ID

**GET** `/venues/:id`

### 3. Get Venues by City

**GET** `/venues/city/:city`

### 4. Get All Cities

**GET** `/venues/cities/all`

---

## 🎭 Show Endpoints

### 1. Get All Shows

**GET** `/shows`
**Query Parameters:**

- `movie` - Filter by movie ID
- `venue` - Filter by venue ID
- `date` - Filter by date
- `page` - Page number
- `limit` - Items per page

### 2. Get Show by ID

**GET** `/shows/:id`

### 3. Get Shows by Movie

**GET** `/shows/movie/:movieId`
**Query Parameters:**

- `date` - Filter by date
- `city` - Filter by city

### 4. Get Shows by Venue

**GET** `/shows/venue/:venueId`
**Query Parameters:**

- `date` - Filter by date

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

- `page` - Page number
- `limit` - Items per page
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
