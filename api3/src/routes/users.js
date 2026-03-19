const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const uploadAvatar = require("../middleware/uploadAvatar");

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const userResult = await pool.query(
      `
      SELECT id, username, first_name, last_name, bio, profile_image_path, created_at
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const followersResult = await pool.query(
      `SELECT COUNT(*)::int AS followers_count FROM follows WHERE following_id = $1`,
      [userId]
    );

    const followingResult = await pool.query(
      `SELECT COUNT(*)::int AS following_count FROM follows WHERE follower_id = $1`,
      [userId]
    );

    res.json({
      ...userResult.rows[0],
      followers_count: followersResult.rows[0].followers_count,
      following_count: followingResult.rows[0].following_count,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.patch("/me", authMiddleware, async (req, res) => {
  try {
    const { first_name, last_name, bio } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        bio = COALESCE($3, bio)
      WHERE id = $4
      RETURNING id, username, first_name, last_name, email, bio, profile_image_path, created_at
      `,
      [first_name, last_name, bio, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.post("/me/avatar", authMiddleware, uploadAvatar.single("avatar"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

    if (!imagePath) {
      return res.status(400).json({ error: "Avatar file is required" });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET profile_image_path = $1
      WHERE id = $2
      RETURNING id, username, first_name, last_name, email, bio, profile_image_path, created_at
      `,
      [imagePath, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});

router.post("/:id/follow", authMiddleware, async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = Number(req.params.id);

    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const targetUser = await pool.query(
      `SELECT id, username FROM users WHERE id = $1`,
      [followingId]
    );

    if (targetUser.rows.length === 0) {
      return res.status(404).json({ error: "Target user not found" });
    }

    const existingFollow = await pool.query(
      `
      SELECT id FROM follows
      WHERE follower_id = $1 AND following_id = $2
      `,
      [followerId, followingId]
    );

    if (existingFollow.rows.length > 0) {
      return res.status(409).json({ error: "Already following this user" });
    }

    await pool.query(
      `
      INSERT INTO follows (follower_id, following_id)
      VALUES ($1, $2)
      `,
      [followerId, followingId]
    );

    await pool.query(
      `
      INSERT INTO notifications (user_id, type, message, related_user_id)
      VALUES ($1, $2, $3, $4)
      `,
      [
        followingId,
        "follow",
        `${req.user.username} started following you`,
        followerId,
      ]
    );

    res.status(201).json({ message: "Followed user successfully" });
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
});

router.delete("/:id/follow", authMiddleware, async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = Number(req.params.id);

    await pool.query(
      `
      DELETE FROM follows
      WHERE follower_id = $1 AND following_id = $2
      `,
      [followerId, followingId]
    );

    res.json({ message: "Unfollowed user successfully" });
  } catch (error) {
    console.error("Unfollow user error:", error);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
});

router.get("/me/notifications", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.patch("/me/notifications/:notificationId/read", authMiddleware, async (req, res) => {
  try {
    const notificationId = Number(req.params.notificationId);

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [notificationId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Read notification error:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

module.exports = router;
