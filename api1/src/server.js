const express = require("express");
const cors = require("cors");
const path = require("path");

const benchesRouter = require("./routes/benches");
const votesRouter = require("./routes/votes");

const app = express();
const PORT = process.env.API1_PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "API 1 Bench Feed Service is running" });
});

app.use("/benches", benchesRouter);
app.use("/benches", votesRouter);

app.listen(PORT, () => {
  console.log(`API 1 running on http://localhost:${PORT}`);
});
