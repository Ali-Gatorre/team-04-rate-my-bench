const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const result = await pool.query(
      `
      SELECT DISTINCT ON (other_user_id)
        other_user_id,
        other_username,
        content AS last_message,
        created_at AS last_message_at
      FROM (
        SELECT
          CASE
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
          END AS other_user_id,
          CASE
            WHEN sender_id = $1 THEN receiver_username
            ELSE sender_username
          END AS other_username,
          content,
          created_at
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
      ) sub
      ORDER BY other_user_id, created_at DESC
      `,
      [currentUserId]
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
    const senderUsername = req.user.username;
    const receiverId = Number(req.params.userId);
    const { receiver_username, content } = req.body;

    if (!receiver_username || !content || !content.trim()) {
      return res.status(400).json({
        error: "receiver_username and content are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO messages
      (sender_id, sender_username, receiver_id, receiver_username, content)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [senderId, senderUsername, receiverId, receiver_username, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.patch("/:messageId/read", authMiddleware, async (req, res) => {
  try {
    const messageId = Number(req.params.messageId);
    const currentUserId = req.user.id;

    const result = await pool.query(
      `
      UPDATE messages
      SET is_read = TRUE
      WHERE id = $1 AND receiver_id = $2
      RETURNING *
      `,
      [messageId, currentUserId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Mark message as read error:", error);
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});

module.exports = router;
