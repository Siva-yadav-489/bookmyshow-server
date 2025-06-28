const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: "no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDetails = await User.findById(decoded.id);
    if (userDetails.role !== "admin") {
      return res.status(401).json({ message: "You dont have access to this" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Unauthorized, token did not match" });
  }
};

module.exports = adminMiddleware;
