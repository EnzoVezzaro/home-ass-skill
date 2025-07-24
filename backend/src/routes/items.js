const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../utils/items.js');

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    
    // Parse query parameters for search and pagination
    const { q, limit = 5, page = 1 } = req.query; // Default limit to 5, page to 1

    let filteredData = data;

    // Apply search filter if 'q' is provided
    if (q) {
      filteredData = data.filter(item => 
        item.name.toLowerCase().includes(q.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(q.toLowerCase())) // Also search by category if it exists
      );
    }

    // Calculate pagination indices
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    // Apply pagination slicing
    const paginatedResults = filteredData.slice(startIndex, endIndex);

    // Calculate total items and total pages
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limitNumber);

    res.json({
      items: paginatedResults,
      totalPages: totalPages,
      currentPage: pageNumber,
      totalItems: totalItems
    });
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
    const { name, category, price, rating, stock } = req.body;

    if (!name) {
      const err = new Error('Name is required');
      err.status = 400;
      throw err;
    }

    const item = { id: 0, name, category, price, rating, stock }; // Create item with provided fields
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
