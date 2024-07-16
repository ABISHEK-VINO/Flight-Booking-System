const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/bookings");
const { mongoURI } = require("./config");
const app = express();
app.use(bodyParser.json());

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/bookings", bookingRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

module.exports = app;
