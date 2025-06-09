const express = require('express');
const router = express.Router();
const { users } = require('../data/users');

router.get('/', (req, res) => {
  res.json(users);
});

router.post('/', (req, res) => {
  const user = { id: Math.random().toString(), ...req.body, isApproved: false };
  users.push(user);
  res.status(201).json(user);
});

router.patch('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    Object.assign(user, req.body);
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

module.exports = router;
