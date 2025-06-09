const express = require('express');
const router = express.Router();
const { classifieds } = require('../data/classifieds');

router.get('/', (req, res) => {
  res.json(classifieds);
});

router.post('/', (req, res) => {
  const classified = {
    id: Math.random().toString(),
    ...req.body,
    status: 'pending'
  };
  classifieds.push(classified);
  res.status(201).json(classified);
});

router.patch('/:id', (req, res) => {
  const classified = classifieds.find(c => c.id === req.params.id);
  if (classified) {
    Object.assign(classified, req.body);
    res.json(classified);
  } else {
    res.status(404).json({ error: 'Classified not found' });
  }
});

router.delete('/:id', (req, res) => {
  const index = classifieds.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    classifieds.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Classified not found' });
  }
});

module.exports = router;
