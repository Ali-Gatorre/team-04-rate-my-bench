const express = require("express");
const cors = require("cors");
const commentsRouter = require("./routes/comments");

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API 2 Discussion Service is running" });
});

app.use("/comments", commentsRouter);

app.listen(PORT, () => {
  console.log(`API 2 running on http://localhost:${PORT}`);
});
