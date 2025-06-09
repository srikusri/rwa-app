const express = require('express');
const router = express.Router();
const { payments } = require('../data/payments');

router.get('/', (req, res) => {
  res.json(payments);
});

router.post('/', (req, res) => {
  const payment = {
    id: Math.random().toString(),
    ...req.body,
    status: 'pending',
    createdAt: new Date()
  };
  payments.push(payment);
  res.status(201).json(payment);
});

router.patch('/:id', (req, res) => {
  const payment = payments.find(p => p.id === req.params.id);
  if (payment) {
    Object.assign(payment, req.body);
    res.json(payment);
  } else {
    res.status(404).json({ error: 'Payment not found' });
  }
});

module.exports = router;
