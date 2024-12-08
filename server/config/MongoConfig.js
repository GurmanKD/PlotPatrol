const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(function (i) {
    console.log("Database is Connected");
  })
  .catch(function (err) {
    console.log(err);
  });
