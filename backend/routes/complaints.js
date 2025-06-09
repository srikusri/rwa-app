const express = require('express');
const router = express.Router();
const { complaints } from require('../data/complaints');

router.get('/', (req, res) => {
  res.json(complaints);
});

router.post('/', (req, res) => {
  const complaint = {
    id: Math.random().toString(),
    ...req.body,
    status: 'open',
    createdAt: new Date()
  };
  complaints.push(complaint);
  res.status(201).json(complaint);
});

router.patch('/:id', (req, res) => {
  const complaint = complaints.find(c => c.id === req.params.id);
  if (complaint) {
    Object.assign(complaint, req.body);
    res.json(complaint);
  } else {
    res.status(404).json({ error: 'Complaint not found' });
  }
});

module.exports = router;
