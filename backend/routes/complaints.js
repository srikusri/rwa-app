const express = require('express');
const router = express.Router();
let { complaints } = require('../data/complaints'); // Use let for reassignment

// GET / (List items)
router.get('/', (req, res) => {
  if (req.user.role === 'superAdmin') {
    res.json(complaints);
  } else {
    res.json(complaints.filter(item => item.tenantId === req.user.tenantId));
  }
});

// GET /:id (Get single item)
router.get('/:id', (req, res) => {
  const item = complaints.find(c => c.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Complaint not found' });
  }
  if (req.user.role === 'superAdmin' || item.tenantId === req.user.tenantId) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Complaint not found' });
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

  const complaint = {
    id: Math.random().toString(),
    ...newItemData,
    tenantId: tenantIdForNewItem,
    status: 'open', // Default status
    createdAt: new Date()
  };
  complaints.push(complaint);
  res.status(201).json(complaint);
});

// PATCH /:id (Update item)
router.patch('/:id', (req, res) => {
  const itemIndex = complaints.findIndex(c => c.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  const item = complaints[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  const updateData = { ...req.body };
  delete updateData.tenantId; // Prevent tenantId change

  complaints[itemIndex] = { ...item, ...updateData };
  res.json(complaints[itemIndex]);
});

// DELETE /:id (Delete item)
router.delete('/:id', (req, res) => {
  const itemIndex = complaints.findIndex(c => c.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  const item = complaints[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  complaints = complaints.filter(c => c.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
