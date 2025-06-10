const express = require('express');
const router = express.Router();
let { classifieds } = require('../data/classifieds'); // Use let for reassignment

// GET / (List items)
router.get('/', (req, res) => {
  if (req.user.role === 'superAdmin') {
    res.json(classifieds);
  } else {
    res.json(classifieds.filter(item => item.tenantId === req.user.tenantId));
  }
});

// GET /:id (Get single item)
router.get('/:id', (req, res) => {
  const item = classifieds.find(c => c.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Classified not found' });
  }
  if (req.user.role === 'superAdmin' || item.tenantId === req.user.tenantId) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Classified not found' });
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

  const classified = {
    id: Math.random().toString(),
    ...newItemData,
    tenantId: tenantIdForNewItem,
    status: 'pending', // Default status
    createdAt: new Date() // Assuming createdAt should be added
  };
  classifieds.push(classified);
  res.status(201).json(classified);
});

// PATCH /:id (Update item)
router.patch('/:id', (req, res) => {
  const itemIndex = classifieds.findIndex(c => c.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Classified not found' });
  }

  const item = classifieds[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Classified not found' });
  }

  const updateData = { ...req.body };
  delete updateData.tenantId; // Prevent tenantId change

  classifieds[itemIndex] = { ...item, ...updateData };
  res.json(classifieds[itemIndex]);
});

// DELETE /:id (Delete item)
router.delete('/:id', (req, res) => {
  const itemIndex = classifieds.findIndex(c => c.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Classified not found' });
  }

  const item = classifieds[itemIndex];
  if (req.user.role !== 'superAdmin' && item.tenantId !== req.user.tenantId) {
    return res.status(404).json({ message: 'Classified not found' });
  }

  classifieds = classifieds.filter(c => c.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
