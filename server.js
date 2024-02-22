const mongoose = require("mongoose");
const app = require("./app.js");
const uriDb = process.env.DB_URI;

const connection = mongoose.connect(uriDb);

connection
  .then(() => {
    app.listen(3000, function () {
      console.log(`Database connection successful`);
    });
  })
  .catch(
    (err) => console.log(`Server not running. Error message: ${err.message}`),
    process.exit(1)
  );
