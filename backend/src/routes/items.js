const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/items.js');

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    
    const { limit, q } = req.query;
    let results = data;

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    if (limit) {
      results = results.slice(0, parseInt(limit));
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const { name, category, price } = req.body;

    if (!name) {
      const err = new Error('Name is required');
      err.status = 400;
      throw err;
    }

    const item = { id: 0, name, category, price }; // Create item with provided fields
    const data = await readData();

    // Generate new ID
    let maxId = 0;
    if (data.length > 0) {
      maxId = Math.max(...data.map(item => item.id));
    }
    item.id = maxId + 1;
    data.push(item);
    
    try {
      await writeData(data);
      res.status(201).json(item);
    } catch (writeErr) {
      const err = new Error('Failed to write file');
      err.status = 500;
      next(err); // Pass the error to the error handler
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
