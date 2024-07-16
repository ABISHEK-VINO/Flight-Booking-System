const express = require('express');
const router = express.Router();
const Booking = require("../models/booking.js");
const sendBookingEmail = require("../sendEmail.js");

const passnumber = () => {
    return 'BP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create
router.post("/", async (req, res) => {
    try {
        const boardingpassnumber = passnumber();
        const newBookingData = {
            flightNumber: req.body.flightNumber,
            passengerName: req.body.passengerName,
            departureDate: req.body.departureDate,
            seatNumber: req.body.seatNumber,
            fromLocation: req.body.fromLocation,
            toLocation: req.body.toLocation,
            boardingpassnumber 
        };
        
        const newBooking = new Booking(newBookingData);
      
        const booking = await newBooking.save();
        console.log(booking);
        await sendBookingEmail(booking);

        const io = req.app.get("socketio");
        io.emit("bookingCreated", booking);

        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read
router.get("/", async (req, res) => {
    try {
        const booking = await Booking.find();
        res.json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message }); 
    }
});

// Update
router.put("/:id", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        await sendBookingEmail(booking, true);
        const io = req.app.get("socketio");
        io.emit("bookingUpdated", booking); // Consistent naming
        res.json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete
router.delete("/:id", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        const io = req.app.get("socketio");
        io.emit("bookingDeleted", req.params.id);
        res.json({ message: "Booking is deleted" });
    } catch (err) {
        res.status (400).json({ error: err.message });
    }
});

module.exports = router;
