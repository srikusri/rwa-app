const express = require('express');
const router = express.Router();
let { bookings } = require('../data/bookings'); // Use let for reassignment

// GET / (List items)
router.get('/', (req, res) => {
  if (req.user.role === 'superAdmin') {
    res.json(bookings);
  } else {
    res.json(bookings.filter(item => item.tenantId === req.user.tenantId));
  }
});

// GET /:id (Get single item)
router.get('/:id', (req, res) => {
  const item = bookings.find(b => b.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (req.user.role === 'superAdmin' || item.tenantId === req.user.tenantId) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Booking not found' });
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

  const booking = {
    id: Math.random().toString(),
    ...newItemData,
    tenantId: tenantIdForNewItem,
    status: 'pending', // Default status
    createdAt: new Date() // Assuming createdAt should be added
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

// PATCH /:id (Update item)
router.patch('/:id', (req, res) => {
  const itemIndex = bookings.findIndex(b => b.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const item = bookings[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const updateData = { ...req.body };
  delete updateData.tenantId; // Prevent tenantId change

  bookings[itemIndex] = { ...item, ...updateData };
  res.json(bookings[itemIndex]);
});

// DELETE /:id (Delete item)
router.delete('/:id', (req, res) => {
  const itemIndex = bookings.findIndex(b => b.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const item = bookings[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  bookings = bookings.filter(b => b.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
