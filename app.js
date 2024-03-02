const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const contactsRouter = require("./routes/contactsRouter.js");
const userRouter = require("./routes/authRouter.js");
const dataBase = require("./server.js");

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", userRouter);

app.use((_, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Route not found",
    data: "Not found",
  });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
