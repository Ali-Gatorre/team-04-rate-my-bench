const comments = [
  {
    id: 1,
    bench_id: 1,
    author_name: "Ali",
    content: "Amazing bench.",
    parent_comment_id: null,
    created_at: "2026-03-10T10:30:00Z",
  },
  {
    id: 2,
    bench_id: 1,
    author_name: "Nabeel",
    content: "Great place to read.",
    parent_comment_id: null,
    created_at: "2026-03-10T11:00:00Z",
  },
  {
    id: 3,
    bench_id: 1,
    author_name: "Sara",
    content: "I agree, very peaceful spot.",
    parent_comment_id: 1,
    created_at: "2026-03-10T11:20:00Z",
  },
];

module.exports = comments;
