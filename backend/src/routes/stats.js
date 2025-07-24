const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { readData } = require('../utils/items.js');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Enhanced cache with timestamp tracking
let statsCache = {
  data: null,
  lastCalculated: null,
  fileModTime: null
};

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Function to calculate stats with better error handling
function calculateStats(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      total: 0,
      averagePrice: 0,
      message: 'No items found'
    };
  }

  const validItems = items.filter(item => 
    item && typeof item.price === 'number' && !isNaN(item.price)
  );

  if (validItems.length === 0) {
    return {
      total: items.length,
      averagePrice: 0,
      message: 'No valid price data found'
    };
  }

  const totalPrice = validItems.reduce((acc, cur) => acc + cur.price, 0);
  
  return {
    total: items.length,
    totalWithValidPrices: validItems.length,
    averagePrice: Math.round((totalPrice / validItems.length) * 100) / 100, // Round to 2 decimal places
    totalValue: Math.round(totalPrice * 100) / 100,
    priceRange: {
      min: Math.min(...validItems.map(item => item.price)),
      max: Math.max(...validItems.map(item => item.price))
    }
  };
}

// Check if file has been modified
async function getFileModTime() {
  try {
    const stats = await fs.stat(DATA_PATH);
    return stats.mtime.getTime();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // File doesn't exist
    }
    throw error;
  }
}

// Check if cache is still valid
async function isCacheValid() {
  if (!statsCache.data || !statsCache.lastCalculated) {
    return false;
  }

  // Check TTL
  const now = Date.now();
  if (now - statsCache.lastCalculated > CACHE_TTL) {
    console.log('Cache expired due to TTL');
    return false;
  }

  // Check if file has been modified
  try {
    const currentModTime = await getFileModTime();
    if (currentModTime && currentModTime !== statsCache.fileModTime) {
      console.log('Cache invalidated due to file modification');
      return false;
    }
  } catch (error) {
    console.warn('Error checking file modification time:', error.message);
    return false;
  }

  return true;
}

// Update cache with new data
async function updateCache(items) {
  const fileModTime = await getFileModTime();
  
  statsCache = {
    data: calculateStats(items),
    lastCalculated: Date.now(),
    fileModTime: fileModTime
  };

  console.log('Stats cache updated');
  return statsCache.data;
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    // Check if cache is valid
    if (await isCacheValid()) {
      console.log('Serving stats from cache');
      return res.json({
        ...statsCache.data,
        cached: true,
        cacheAge: Math.round((Date.now() - statsCache.lastCalculated) / 1000) // seconds
      });
    }

    // Cache is invalid, read fresh data
    console.log('Cache miss or invalid, calculating fresh stats');
    const items = await readData();
    const stats = await updateCache(items);

    res.json({
      ...stats,
      cached: false
    });

  } catch (error) {
    console.error('Error calculating stats:', error);
    next(error);
  }
});

module.exports = router;