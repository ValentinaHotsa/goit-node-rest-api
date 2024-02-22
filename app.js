const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const contactsRouter = require("./routes/contactsRouter.js");

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

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

// const mongoose = require("mongoose");
// // const app = require("./app");
// const uriDb = process.env.DB_URI;

// const connection = mongoose.connect(uriDb);

// connection
//   .then(() => {
//     console.log(`Database connection successful`);

//     app.listen(3000, function () {
//       console.log(`Server is running. Use our API on port: 3000`);
//     });
//   })
//   .catch(
//     (err) => console.log(`Server not running. Error message: ${err.message}`),
//     process.exit(1)
//   );

// module.exports = { app };

// app.listen(3000, () => {
//   console.log("Server is running. Use our API on port: 3000");
// });
// const uriDb = process.env.DB_URI;

// const connection = mongoose.connect(uriDb);
// connection
//   .then(() => {
//     app.listen(3000, function () {
//       console.log(`Database connection successful`);
//     });
//   })
//   .catch(
//     (err) => console.log(`Server not running. Error message: ${err.message}`),
//     process.exit(1)
//   );
