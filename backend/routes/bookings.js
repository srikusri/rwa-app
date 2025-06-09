const express = require('express');
const router = express.Router();
const { bookings } = require('../data/bookings');

router.get('/', (req, res) => {
  res.json(bookings);
});

router.post('/', (req, res) => {
  const booking = {
    id: Math.random().toString(),
    ...req.body,
    status: 'pending'
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

module.exports = router;
