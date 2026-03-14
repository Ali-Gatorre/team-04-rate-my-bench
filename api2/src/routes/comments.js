const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const { bench_id } = req.query;

    if (bench_id) {
      const result = await pool.query(
        "SELECT * FROM comments WHERE bench_id = $1 ORDER BY created_at ASC",
        [bench_id]
      );
      return res.json(result.rows);
    }

    const result = await pool.query(
      "SELECT * FROM comments ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { bench_id, author_name, content, parent_comment_id = null } = req.body;

    if (!bench_id || !author_name || !content) {
      return res.status(400).json({
        error: "bench_id, author_name and content are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO comments (bench_id, author_name, content, parent_comment_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [bench_id, author_name, content, parent_comment_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

module.exports = router;
