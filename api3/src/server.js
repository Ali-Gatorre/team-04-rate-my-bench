const express = require("express");
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");

const app = express();
const PORT = process.env.API3_PORT || 5003;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "API 3 User Service is running" });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

app.listen(PORT,"0.0.0.0" ,() => {
  console.log(`API 3 running on http://0.0.0.0:${PORT}`);
});
