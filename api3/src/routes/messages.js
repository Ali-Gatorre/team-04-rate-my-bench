const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT DISTINCT
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        u.profile_image_path
      FROM messages m
      JOIN users u
        ON u.id = CASE
          WHEN m.sender_id = $1 THEN m.receiver_id
          ELSE m.sender_id
        END
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = Number(req.params.userId);

    const result = await pool.query(
      `
      SELECT *
      FROM messages
      WHERE
        (sender_id = $1 AND receiver_id = $2)
        OR
        (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
      `,
      [currentUserId, otherUserId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/:userId", authMiddleware, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = Number(req.params.userId);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [senderId, receiverId, content]
    );

    await pool.query(
      `
      INSERT INTO notifications (user_id, type, message, related_user_id)
      VALUES ($1, $2, $3, $4)
      `,
      [receiverId, "message", `${req.user.username} sent you a message`, senderId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;
