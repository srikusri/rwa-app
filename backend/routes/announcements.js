const express = require('express');
const router = express.Router();
const { announcements } = require('../data/announcements');

router.get('/', (req, res) => {
  res.json(announcements);
});

router.post('/', (req, res) => {
  const announcement = {
    id: Math.random().toString(),
    ...req.body,
    createdAt: new Date()
  };
  announcements.push(announcement);
  res.status(201).json(announcement);
});

module.exports = router;
