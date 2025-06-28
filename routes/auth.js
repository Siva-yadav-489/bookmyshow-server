const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware.js");
const adminMiddleware = require("../middleware/adminMiddleware.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, city, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      role,
    });
    await newUser.save();
    return res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Inavalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  const id = req.user.id;
  const userDetails = await User.findById(id);
  res.json({ userDetails });
});

router.put("/profile", authMiddleware, async (req, res) => {
  const id = req.user.id;
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userDetails = await User.findByIdAndUpdate(
    id,
    { name, email, hashedPassword },
    { new: true }
  );
  await userDetails.save();
  res.json({ messsage: "updated!!", userDetails });
});

router.delete("/profile", authMiddleware, async (req, res) => {
  const id = req.user.id;
  const userDetails = await User.findByIdAndDelete(id);
  res.json({ messsage: "Deleted!!", userDetails });
});

router.get("/admin", adminMiddleware, async (req, res) => {
  const allUsers = await User.find({});
  if (allUsers.length <= 0) {
    res.json({ message: "there are no users yet" });
  }
  res.status(200).json({ allUsers });
});

module.exports = router;
