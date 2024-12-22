const express = require("express");
const jwt = require("jsonwebtoken");
const { getUserByUsername } = require("../models/userModel");

const router = express.Router();

// Login route
router.post("/", (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Fetch user from the database by username
  getUserByUsername(username, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Database error", error });
    }
    if (results.length === 0) {
      console.warn(`Login failed for username: ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = results[0];

    if (password !== user.password) {
      console.warn(
        `Login failed for username: ${username} - Password mismatch`
      );
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" }
    );

    console.log(`Login successful for username: ${username}`);

    return res.status(200).json({ message: "Login successful", token });
  });
});

module.exports = router;
