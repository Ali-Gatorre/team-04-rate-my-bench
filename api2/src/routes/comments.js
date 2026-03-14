const express = require("express");
const router = express.Router();
const comments = require("../data/comments");

router.get("/", (req, res) => {
  const { bench_id } = req.query;

  if (bench_id) {
    const filteredComments = comments.filter(
      (comment) => comment.bench_id === Number(bench_id)
    );
    return res.json(filteredComments);
  }

  res.json(comments);
});

router.post("/", (req, res) => {
  const { bench_id, author_name, content } = req.body;

  if (!bench_id || !author_name || !content) {
    return res.status(400).json({
      error: "bench_id, author_name and content are required",
    });
  }

  const newComment = {
    id: comments.length + 1,
    bench_id: Number(bench_id),
    author_name,
    content,
    created_at: new Date().toISOString(),
  };

  comments.push(newComment);

  res.status(201).json(newComment);
});

module.exports = router;
