const express = require("express");
const cors = require("cors");
const messagesRouter = require("./routes/messages");

const app = express();
const PORT = process.env.API4_PORT || 5004;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API 4 Message Service is running" });
});

app.use("/messages", messagesRouter);

app.listen(PORT, () => {
  console.log(`API 4 running on http://localhost:${PORT}`);
});
