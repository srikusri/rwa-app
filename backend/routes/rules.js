const express = require('express');
const router = express.Router();
let { rules } = require('../data/rules'); // Use let for reassignment

// GET / (List items)
router.get('/', (req, res) => {
  if (req.user.role === 'superAdmin') {
    res.json(rules);
  } else {
    res.json(rules.filter(item => item.tenantId === req.user.tenantId));
  }
});

// GET /:id (Get single item)
router.get('/:id', (req, res) => {
  const item = rules.find(r => r.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Rule not found' });
  }
  if (req.user.role === 'superAdmin' || item.tenantId === req.user.tenantId) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Rule not found' });
  }
});

// POST / (Create new item)
router.post('/', (req, res) => {
  let tenantIdForNewItem;
  const { rule, ...otherProps } = req.body; // Destructure to get rule description
  const newItemData = { rule, ...otherProps };


  if (req.user.role === 'superAdmin') {
    if (!req.body.tenantId) {
      return res.status(400).json({ message: 'tenantId is required for superAdmin' });
    }
    tenantIdForNewItem = req.body.tenantId;
  } else {
    // tenantAdmin can create rules for their tenant.
    // Residents should not be able to create rules. Add role check if needed.
    if (req.user.role !== 'tenantAdmin' && req.user.role !== 'superAdmin') {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions to create rule' });
    }
    tenantIdForNewItem = req.user.tenantId;
    delete newItemData.tenantId;
  }

  if (!rule) {
    return res.status(400).json({ message: 'Rule description is required' });
  }

  const newRule = {
    id: `rule${rules.length + 1}`, // Simple ID generation
    ...newItemData,
    rule, // Ensure rule description is included
    tenantId: tenantIdForNewItem,
    createdAt: new Date()
  };
  rules.push(newRule);
  res.status(201).json(newRule);
});

// PATCH /:id (Update item)
router.patch('/:id', (req, res) => {
  const itemIndex = rules.findIndex(r => r.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Rule not found' });
  }

  const item = rules[itemIndex];
  // Only superAdmin or tenantAdmin of the same tenant can edit.
  if (req.user.role !== 'superAdmin' && !(req.user.role === 'tenantAdmin' && item.tenantId === req.user.tenantId)) {
    return res.status(404).json({ message: 'Rule not found' }); // Or 403
  }

  // Residents should not be able to update rules.
  if (req.user.role === 'resident') {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions to update rule' });
  }

  const updateData = { ...req.body };
  delete updateData.tenantId; // Prevent tenantId change
  if (updateData.id) delete updateData.id; // Prevent id change

  rules[itemIndex] = { ...item, ...updateData };
  res.json(rules[itemIndex]);
});

// DELETE /:id (Delete item)
router.delete('/:id', (req, res) => {
  const itemIndex = rules.findIndex(r => r.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Rule not found' });
  }

  const item = rules[itemIndex];
  // Only superAdmin or tenantAdmin of the same tenant can delete.
  if (req.user.role !== 'superAdmin' && !(req.user.role === 'tenantAdmin' && item.tenantId === req.user.tenantId)) {
    return res.status(404).json({ message: 'Rule not found' }); // Or 403
  }

  // Residents should not be able to delete rules.
  if (req.user.role === 'resident') {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions to delete rule' });
  }

  rules = rules.filter(r => r.id !== req.params.id);
  res.status(204).send();
});

module.exports = router;
