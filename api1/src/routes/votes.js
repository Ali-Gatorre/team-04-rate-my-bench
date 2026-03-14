const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/:id/vote", async (req, res) => {
  try {
    const benchId = Number(req.params.id);
    const { author_name, vote_type } = req.body;

    if (!author_name || !vote_type) {
      return res.status(400).json({
        error: "author_name and vote_type are required",
      });
    }

    const numericVote = Number(vote_type);

    if (![1, -1].includes(numericVote)) {
      return res.status(400).json({
        error: "vote_type must be 1 or -1",
      });
    }

    const benchCheck = await pool.query(
      "SELECT id FROM benches WHERE id = $1",
      [benchId]
    );

    if (benchCheck.rows.length === 0) {
      return res.status(404).json({ error: "Bench not found" });
    }

    const existingVote = await pool.query(
      `
      SELECT id FROM bench_votes
      WHERE bench_id = $1 AND author_name = $2
      `,
      [benchId, author_name]
    );

    if (existingVote.rows.length > 0) {
      const updatedVote = await pool.query(
        `
        UPDATE bench_votes
        SET vote_type = $1, created_at = CURRENT_TIMESTAMP
        WHERE bench_id = $2 AND author_name = $3
        RETURNING *
        `,
        [numericVote, benchId, author_name]
      );

      return res.json(updatedVote.rows[0]);
    }

    const newVote = await pool.query(
      `
      INSERT INTO bench_votes (bench_id, author_name, vote_type)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [benchId, author_name, numericVote]
    );

    res.status(201).json(newVote.rows[0]);
  } catch (error) {
    console.error("Error voting on bench:", error);
    res.status(500).json({ error: "Failed to vote on bench" });
  }
});

module.exports = router;
