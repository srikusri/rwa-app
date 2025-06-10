const express = require('express');
const router = express.Router();
let { payments } = require('../data/payments'); // Use let for reassignment

// GET / (List items)
router.get('/', (req, res) => {
  if (req.user.role === 'superAdmin') {
    res.json(payments);
  } else {
    res.json(payments.filter(item => item.tenantId === req.user.tenantId));
  }
});

// GET /:id (Get single item)
router.get('/:id', (req, res) => {
  const item = payments.find(p => p.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  if (req.user.role === 'superAdmin' || item.tenantId === req.user.tenantId) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Payment not found' });
  }
});

// POST / (Create new item)
router.post('/', (req, res) => {
  let tenantIdForNewItem;
  const newItemData = { ...req.body };

  if (req.user.role === 'superAdmin') {
    if (!req.body.tenantId) {
      return res.status(400).json({ message: 'tenantId is required for superAdmin' });
    }
    tenantIdForNewItem = req.body.tenantId;
  } else {
    tenantIdForNewItem = req.user.tenantId;
    delete newItemData.tenantId;
  }

  const payment = {
    id: Math.random().toString(),
    ...newItemData,
    tenantId: tenantIdForNewItem,
    status: 'pending', // Default status
    createdAt: new Date()
  };
  payments.push(payment);
  res.status(201).json(payment);
});

// PATCH /:id (Update item)
router.patch('/:id', (req, res) => {
  const itemIndex = payments.findIndex(p => p.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  const item = payments[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  const updateData = { ...req.body };
  delete updateData.tenantId; // Prevent tenantId change

  payments[itemIndex] = { ...item, ...updateData };
  res.json(payments[itemIndex]);
});

// DELETE /:id (Delete item)
router.delete('/:id', (req, res) => {
  const itemIndex = payments.findIndex(p => p.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  const item = payments[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  payments = payments.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
