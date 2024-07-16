const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  flightNumber: { type: String, required: true },
  boardingpassnumber: { type: String },
  passengerName: { type: String, required: true },
  departureDate: { type: String, required: true },
  seatNumber: { type: String, required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
});

module.exports = mongoose.model('Booking', BookingSchema);
