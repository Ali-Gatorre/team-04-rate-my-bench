const express = require("express");
const router = express.Router();
const pool = require("../db");
const upload = require("../middleware/upload");

router.get("/", async (req, res) => {
  try {
    const { search, sort } = req.query;

    let query = `
      SELECT
        b.id,
        b.title,
        b.caption,
        b.image_path,
        b.location_name,
        b.latitude,
        b.longitude,
        b.author_name,
        b.created_at,
        COALESCE(SUM(v.vote_type), 0)::int AS score,
        COALESCE(SUM(CASE WHEN v.vote_type = 1 THEN 1 ELSE 0 END), 0)::int AS upvotes,
        COALESCE(SUM(CASE WHEN v.vote_type = -1 THEN 1 ELSE 0 END), 0)::int AS downvotes
      FROM benches b
      LEFT JOIN bench_votes v ON b.id = v.bench_id
    `;

    const values = [];

    if (search) {
      query += `
        WHERE
          LOWER(b.title) LIKE LOWER($1)
          OR LOWER(b.caption) LIKE LOWER($1)
          OR LOWER(COALESCE(b.location_name, '')) LIKE LOWER($1)
      `;
      values.push(`%${search}%`);
    }

    query += ` GROUP BY b.id `;

    if (sort === "top") {
      query += ` ORDER BY score DESC, b.created_at DESC `;
    } else {
      query += ` ORDER BY b.created_at DESC `;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching benches:", error);
    res.status(500).json({ error: "Failed to fetch benches" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.title,
        b.caption,
        b.image_path,
        b.location_name,
        b.latitude,
        b.longitude,
        b.author_name,
        b.created_at,
        COALESCE(SUM(v.vote_type), 0)::int AS score,
        COALESCE(SUM(CASE WHEN v.vote_type = 1 THEN 1 ELSE 0 END), 0)::int AS upvotes,
        COALESCE(SUM(CASE WHEN v.vote_type = -1 THEN 1 ELSE 0 END), 0)::int AS downvotes
      FROM benches b
      LEFT JOIN bench_votes v ON b.id = v.bench_id
      WHERE b.id = $1
      GROUP BY b.id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bench not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching bench:", error);
    res.status(500).json({ error: "Failed to fetch bench" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      caption,
      location_name,
      latitude,
      longitude,
      author_name,
    } = req.body;

    if (!title || !caption || !author_name) {
      return res.status(400).json({
        error: "title, caption and author_name are required",
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `
      INSERT INTO benches
      (title, caption, image_path, location_name, latitude, longitude, author_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [title, caption, imagePath, location_name, latitude || null, longitude || null, author_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating bench:", error);
    res.status(500).json({ error: "Failed to create bench" });
  }
});

module.exports = router;
