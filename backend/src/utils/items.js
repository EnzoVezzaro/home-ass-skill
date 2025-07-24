const path = require('path');
const fs = require('fs');
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data (intentionally sync to highlight blocking issue)
async function readData() {
  const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// Utility to write data asynchronously
async function writeData(data) {
  await fs.promises.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readData, writeData };
