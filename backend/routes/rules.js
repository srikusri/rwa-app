const express = require('express');
const router = express.Router();
const { rules } = require('../data/rules');

router.get('/', (req, res) => {
  res.json(rules);
});

module.exports = router;
