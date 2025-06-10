const express = require('express');
const router = express.Router();
let { announcements } = require('../data/announcements'); // Use let for reassignment

// GET / (List items)
router.get('/', (req, res) => {
  if (req.user.role === 'superAdmin') {
    res.json(announcements);
  } else {
    res.json(announcements.filter(item => item.tenantId === req.user.tenantId));
  }
});

// GET /:id (Get single item)
router.get('/:id', (req, res) => {
  const item = announcements.find(a => a.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Announcement not found' });
  }
  if (req.user.role === 'superAdmin' || item.tenantId === req.user.tenantId) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Announcement not found' }); // Or 403, but 404 as per instruction
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
    delete newItemData.tenantId; // Remove if present, user cannot set arbitrarily
  }

  const announcement = {
    id: Math.random().toString(),
    ...newItemData,
    tenantId: tenantIdForNewItem,
    createdAt: new Date()
  };
  announcements.push(announcement);
  res.status(201).json(announcement);
});

// PATCH /:id (Update item)
router.patch('/:id', (req, res) => {
  const itemIndex = announcements.findIndex(a => a.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  const item = announcements[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Announcement not found' }); // Or 403
  }

  // Prevent tenantId change
  const updateData = { ...req.body };
  delete updateData.tenantId;

  announcements[itemIndex] = { ...item, ...updateData };
  res.json(announcements[itemIndex]);
});

// DELETE /:id (Delete item)
router.delete('/:id', (req, res) => {
  const itemIndex = announcements.findIndex(a => a.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Announcement not found' });
  }

  const item = announcements[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Announcement not found' }); // Or 403
  }

  announcements = announcements.filter(a => a.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
