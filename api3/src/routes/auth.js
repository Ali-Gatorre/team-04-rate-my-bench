const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const {
  isValidUsername,
  isValidPassword,
  isValidName,
  isValidEmail,
} = require("../utils/validators");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      password,
      bio = "",
      profile_image_path = null,
    } = req.body;

    if (!username || !first_name || !last_name || !email || !password) {
      return res.status(400).json({
        error: "username, first_name, last_name, email and password are required",
      });
    }

    if (!isValidUsername(username)) {
      return res.status(400).json({
        error:
          "Username must be 3-20 characters and contain only letters, numbers, dots or underscores",
      });
    }

    if (!isValidName(first_name) || !isValidName(last_name)) {
      return res.status(400).json({
        error: "First name and last name contain invalid characters",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include uppercase, lowercase, number and special character",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Username or email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (username, first_name, last_name, email, password_hash, bio, profile_image_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, first_name, last_name, email, bio, profile_image_path, created_at
      `,
      [username, first_name, last_name, email, passwordHash, bio, profile_image_path]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "super_secret_dev_key",
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        error: "login and password are required",
      });
    }

    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE username = $1 OR email = $1
      `,
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "super_secret_dev_key",
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        bio: user.bio,
        profile_image_path: user.profile_image_path,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, username, first_name, last_name, email, bio, profile_image_path, created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Auth me error:", error);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
});

module.exports = router;
